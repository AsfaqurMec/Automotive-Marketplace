# Backend Implementation Guide for Vehicle Status Change & Sold Feature

This document provides a comprehensive guide for implementing the backend API endpoints for vehicle status changes and marking vehicles as sold.

## Overview

The frontend requires two main API endpoints:
1. **Update Vehicle Status** - For changing status to: Pending, Available, or Discontinued
2. **Mark Vehicle as Sold** - For marking a vehicle as sold with buyer information

---

## API Endpoints

### 1. Update Vehicle Status

**Endpoint:** `PATCH /api/vehicale/:id/status`

**Purpose:** Update the status of a vehicle to one of: `Pending`, `Available`, or `Discontinued`

**Request Body:**
```json
{
  "status": "Pending" | "Available" | "Discontinued"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Vehicle status updated successfully",
  "data": {
    "_id": "vehicle_id",
    "title": "Vehicle Title",
    "status": "Pending",
    // ... other vehicle fields
  }
}
```

**Response (Error - 400/404/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Implementation Notes:**
- Validate that the status is one of the allowed values
- Update the vehicle status in the database
- Optionally log the status change history
- Return the updated vehicle object

---

### 2. Mark Vehicle as Sold

**Endpoint:** `POST /api/vehicale/:id/sold`

**Purpose:** Mark a vehicle as sold, update vehicle status, and create a sale record in the `catSell` collection

**Request Body:**
```json
{
  "amount": 25000,
  "sellerId": "seller_user_id",
  "dealerID": "dealer_id_if_internal" | "",
  "name": "Buyer Name",
  "email": "buyer@example.com",
  "contact": "+1234567890",
  "country": "United States"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Vehicle marked as sold successfully",
  "data": {
    "_id": "vehicle_id",
    "status": "Sold",
    // ... other vehicle fields
  }
}
```

**Response (Error - 400/404/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Implementation Notes:**
1. **Validate all required fields:**
   - `amount` (must be > 0)
   - `sellerId` (must be valid user ID)
   - `name`, `email`, `contact` (required)
   - If `dealerID` is provided and not empty, validate that the dealer exists

2. **Update Vehicle Status:**
   - Set vehicle status to "Sold"
   - Update the vehicle's `updatedAt` timestamp

3. **Create catSell Collection Entry:**
   - Create a new document in the `catSell` collection with:
     - `amount` (Number)
     - `sellerId` (ObjectId, ref: User)
     - `dealerID` (String, empty string if external buyer)
     - `name` (String)
     - `email` (String)
     - `contact` (String)
     - `createdAt` (Date - automatically set)

4. **Optional:**
   - Send notification emails to seller and buyer
   - Update vehicle's saleInfo field (if keeping it for quick access)

5. **Important:** This endpoint should handle BOTH:
   - Updating the vehicle status to "Sold"
   - Creating the catSell collection entry
   - All in a single transaction if possible for data consistency

---

## Database Schema Considerations

### Vehicle Schema Updates

Add/Update fields in your Vehicle model:

```javascript
{
  // ... existing vehicle fields
  status: {
    type: String,
    enum: ['Pending', 'Sold', 'Available', 'Discontinued'],
    default: 'Available'
  },
  saleInfo: {
    amount: Number,
    soldDate: Date,
    buyer: {
      name: String,
      email: String,
      contact: String,
      country: String,
      type: {
        type: String,
        enum: ['internal', 'external']
      },
      dealerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
      }
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}
```

### catSell Collection Schema

**Required:** Create a new collection named `catSell` to store vehicle sale records.

**catSell Schema (Mongoose):**
```javascript
const catSellSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dealerID: {
    type: String,
    default: ""  // Empty string for external buyers, dealer ID for internal buyers
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false  // We're manually setting createdAt
});

const CatSell = mongoose.model('CatSell', catSellSchema);
```

**Note:** If you want to track which vehicle was sold, you can optionally add:
```javascript
vehicleId: {
  type: Schema.Types.ObjectId,
  ref: 'Vehicle',
  required: false  // Optional, but recommended for reporting
}
```

---

## Backend Implementation Example (Node.js/Express with Mongoose)

### Controller Implementation

```javascript
// controllers/vehicleController.js

// Update Vehicle Status
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ['Pending', 'Available', 'Discontinued'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, Available, Discontinued'
      });
    }

    // Find and update vehicle
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('postedBy', 'fullName email');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Optionally log status change
    await StatusHistory.create({
      vehicleId: vehicle._id,
      oldStatus: vehicle.status,
      newStatus: status,
      changedBy: req.user._id,
      changedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle status updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Mark Vehicle as Sold
exports.markVehicleAsSold = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, sellerId, dealerID, name, email, contact } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    if (!name || !email || !contact || !sellerId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Name, email, contact, and sellerId are required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Find vehicle
    const vehicle = await Vehicle.findById(id).session(session);
    if (!vehicle) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Validate seller exists
    const seller = await User.findById(sellerId).session(session);
    if (!seller) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Invalid seller ID'
      });
    }

    // If dealerID is provided, validate dealer exists
    if (dealerID && dealerID.trim() !== '') {
      const dealer = await User.findById(dealerID).session(session);
      if (!dealer || dealer.role?.roleId !== 'dealer') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'Invalid dealer ID'
        });
      }
    }

    // Update vehicle status to "Sold"
    vehicle.status = 'Sold';
    vehicle.updatedAt = new Date();
    await vehicle.save({ session });

    // Create catSell collection entry
    const catSellData = {
      amount,
      sellerId,
      dealerID: (dealerID && dealerID.trim() !== '') ? dealerID : '',
      name,
      email,
      contact,
      createdAt: new Date()
    };

    // Assuming you have a CatSell model
    await CatSell.create([catSellData], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Populate vehicle data for response
    await vehicle.populate('postedBy', 'fullName email');

    // Optionally send notifications
    // await sendSaleNotification(vehicle, catSellData);

    res.status(200).json({
      success: true,
      message: 'Vehicle marked as sold successfully',
      data: vehicle
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error marking vehicle as sold:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
```

### Route Implementation

```javascript
// routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/auth');

// Update vehicle status
router.patch(
  '/:id/status',
  authenticate,
  authorize('car', 'edit'), // Adjust based on your authorization logic
  vehicleController.updateVehicleStatus
);

// Mark vehicle as sold
router.post(
  '/:id/sold',
  authenticate,
  authorize('car', 'edit'), // Adjust based on your authorization logic
  vehicleController.markVehicleAsSold
);

module.exports = router;
```

---

## Security Considerations

1. **Authentication & Authorization:**
   - Ensure only authenticated users can access these endpoints
   - Verify the user has permission to edit vehicles (e.g., owner, admin)
   - For sold endpoint, optionally verify that sellerId matches the authenticated user or they're an admin

2. **Input Validation:**
   - Validate all input fields
   - Sanitize user inputs to prevent injection attacks
   - Validate email format
   - Validate phone number format (optional)
   - Ensure amount is a positive number

3. **Data Integrity:**
   - Use database transactions if creating multiple records
   - Validate that vehicle exists before updating
   - Validate that dealer exists if dealerID is provided
   - Prevent duplicate sales (check if vehicle is already sold)

---

## Additional Features to Consider

1. **Status History Tracking:**
   - Keep a log of all status changes with timestamps and user who made the change

2. **Notifications:**
   - Send email notifications when a vehicle is marked as sold
   - Notify the seller and buyer

3. **Sales Reporting:**
   - Create endpoints to query sales data
   - Generate sales reports by date range, dealer, etc.

4. **Audit Trail:**
   - Log all status changes and sales for compliance

5. **Validation Rules:**
   - Prevent marking already sold vehicles as sold again
   - Validate that sellerId is valid user

---

## Testing Checklist

- [ ] Test updating status to each allowed value (Pending, Available, Discontinued)
- [ ] Test updating status with invalid values
- [ ] Test marking vehicle as sold with internal buyer (with dealerID)
- [ ] Test marking vehicle as sold with external buyer (without dealerID)
- [ ] Test validation errors (missing fields, invalid email, etc.)
- [ ] Test with non-existent vehicle ID
- [ ] Test with non-existent dealer ID (for internal buyer)
- [ ] Test authorization (unauthorized users cannot access)
- [ ] Test that vehicle status is updated correctly
- [ ] Test that sale information is stored correctly

---

## Error Handling

Ensure proper error handling for:
- Invalid vehicle ID
- Invalid dealer ID
- Missing required fields
- Invalid data types
- Database connection errors
- Permission errors

---

## Notes

- Adjust field names and validation rules based on your existing schema
- Modify authorization logic to match your permission system
- Consider adding indexes on frequently queried fields (status, soldDate, etc.)
- Update API documentation (Swagger/OpenAPI) with these new endpoints

