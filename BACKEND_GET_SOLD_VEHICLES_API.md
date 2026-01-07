# Backend GET API Implementation Guide - Sold Vehicles (catSell Collection)

This document provides a comprehensive guide for implementing the GET API endpoint to fetch sold vehicles data from the `catSell` collection.

---

## API Endpoint

**Endpoint:** `GET /api/catSell`

**Purpose:** Fetch paginated list of sold vehicles with search functionality (Admin only)

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number for pagination
- `limit` (number, optional, default: 10) - Number of items per page
- `search` (string, optional, default: '') - Search term to filter by buyer name, email, or vehicle title

**Example Request:**
```
GET /api/catSell?page=1&limit=10&search=john
```

---

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "message": "Sold vehicles fetched successfully",
  "data": {
    "data": [
      {
        "_id": "catSell_id_1",
        "amount": 25000,
        "sellerId": "seller_user_id",
        "dealerID": "dealer_id_if_internal" | "",
        "name": "Buyer Name",
        "email": "buyer@example.com",
        "contact": "+1234567890",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "vehicleId": "vehicle_id_optional",
        "vehicle": {
          "_id": "vehicle_id",
          "title": "2020 Toyota Camry",
          "brand": "Toyota",
          "model": "Camry",
          "year": 2020,
          "price": 25000,
          "media": [
            {
              "url": "https://example.com/image.jpg"
            }
          ]
        },
        "seller": {
          "_id": "seller_user_id",
          "fullName": "Seller Name",
          "email": "seller@example.com"
        },
        "dealer": {
          "_id": "dealer_id",
          "fullName": "Dealer Name",
          "companyName": "Dealer Company",
          "email": "dealer@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "pages": 5,
      "total": 47
    }
  }
}
```

### Error Response (401/403/500)

```json
{
  "success": false,
  "message": "Unauthorized: Admin access required"
}
```

---

## Implementation Details

### 1. Authentication & Authorization

- **Required:** User must be authenticated
- **Required:** User must have `admin` or `superAdmin` role
- **Permission Check:** Verify user has `adminPanel` module with `view` action

### 2. Query Parameters Validation

```javascript
// Validate and set defaults
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max 100 per page
const search = (req.query.search || '').trim();
```

### 3. Database Query

**Mongoose Example:**

```javascript
// Build search query
const searchQuery = {};
if (search) {
  searchQuery.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { contact: { $regex: search, $options: 'i' } },
  ];
}

// Calculate skip value
const skip = (page - 1) * limit;

// Fetch data with pagination
const [catSellData, total] = await Promise.all([
  CatSell.find(searchQuery)
    .populate({
      path: 'vehicleId',
      select: 'title brand model year price media',
      model: 'Vehicle'
    })
    .populate({
      path: 'sellerId',
      select: 'fullName email',
      model: 'User'
    })
    .populate({
      path: 'dealerID',
      select: 'fullName companyName email',
      model: 'User',
      match: { role: { roleId: 'dealer' } }
    })
    .sort({ createdAt: -1 }) // Most recent first
    .skip(skip)
    .limit(limit)
    .lean(),
  CatSell.countDocuments(searchQuery)
]);

// Calculate pagination
const pages = Math.ceil(total / limit);
```

### 4. Response Formatting

```javascript
// Format response
const formattedData = catSellData.map((sale) => ({
  _id: sale._id,
  amount: sale.amount,
  sellerId: sale.sellerId?._id || sale.sellerId,
  dealerID: sale.dealerID || '',
  name: sale.name,
  email: sale.email,
  contact: sale.contact,
  createdAt: sale.createdAt,
  vehicleId: sale.vehicleId?._id || sale.vehicleId,
  vehicle: sale.vehicleId ? {
    _id: sale.vehicleId._id,
    title: sale.vehicleId.title,
    brand: sale.vehicleId.brand,
    model: sale.vehicleId.model,
    year: sale.vehicleId.year,
    price: sale.vehicleId.price,
    media: sale.vehicleId.media || []
  } : null,
  seller: sale.sellerId ? {
    _id: sale.sellerId._id,
    fullName: sale.sellerId.fullName,
    email: sale.sellerId.email
  } : null,
  dealer: sale.dealerID ? {
    _id: sale.dealerID._id,
    fullName: sale.dealerID.fullName,
    companyName: sale.dealerID.companyName,
    email: sale.dealerID.email
  } : null
}));

return res.status(200).json({
  success: true,
  message: 'Sold vehicles fetched successfully',
  data: {
    data: formattedData,
    pagination: {
      page,
      limit,
      pages,
      total
    }
  }
});
```

---

## Complete Controller Implementation (Node.js/Express with Mongoose)

```javascript
// controllers/catSellController.js

const CatSell = require('../models/CatSell');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

exports.getSoldVehicles = async (req, res) => {
  try {
    // 1. Authorization Check
    const user = req.user; // Assuming user is attached by auth middleware
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    // Check if user is admin or superAdmin
    if (user.role?.roleId !== 'admin' && user.role?.roleId !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    }

    // 2. Validate and parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = (req.query.search || '').trim();

    // 3. Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
      ];
    }

    // 4. Calculate pagination
    const skip = (page - 1) * limit;

    // 5. Fetch data with population
    const [catSellData, total] = await Promise.all([
      CatSell.find(searchQuery)
        .populate({
          path: 'vehicleId',
          select: 'title brand model year price media',
          model: 'Vehicle'
        })
        .populate({
          path: 'sellerId',
          select: 'fullName email',
          model: 'User'
        })
        .populate({
          path: 'dealerID',
          select: 'fullName companyName email',
          model: 'User',
          match: { 'role.roleId': 'dealer' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CatSell.countDocuments(searchQuery)
    ]);

    // 6. Calculate pagination metadata
    const pages = Math.ceil(total / limit);

    // 7. Format response data
    const formattedData = catSellData.map((sale) => {
      const formatted = {
        _id: sale._id,
        amount: sale.amount,
        sellerId: sale.sellerId?._id || sale.sellerId,
        dealerID: sale.dealerID || '',
        name: sale.name,
        email: sale.email,
        contact: sale.contact,
        createdAt: sale.createdAt,
      };

      // Add vehicle if exists
      if (sale.vehicleId && typeof sale.vehicleId === 'object') {
        formatted.vehicleId = sale.vehicleId._id;
        formatted.vehicle = {
          _id: sale.vehicleId._id,
          title: sale.vehicleId.title,
          brand: sale.vehicleId.brand,
          model: sale.vehicleId.model,
          year: sale.vehicleId.year,
          price: sale.vehicleId.price,
          media: sale.vehicleId.media || []
        };
      } else if (sale.vehicleId) {
        formatted.vehicleId = sale.vehicleId;
      }

      // Add seller if exists
      if (sale.sellerId && typeof sale.sellerId === 'object') {
        formatted.seller = {
          _id: sale.sellerId._id,
          fullName: sale.sellerId.fullName,
          email: sale.sellerId.email
        };
      }

      // Add dealer if exists (only if dealerID is not empty string)
      if (sale.dealerID && typeof sale.dealerID === 'object') {
        formatted.dealer = {
          _id: sale.dealerID._id,
          fullName: sale.dealerID.fullName,
          companyName: sale.dealerID.companyName,
          email: sale.dealerID.email
        };
      }

      return formatted;
    });

    // 8. Return response
    res.status(200).json({
      success: true,
      message: 'Sold vehicles fetched successfully',
      data: {
        data: formattedData,
        pagination: {
          page,
          limit,
          pages,
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching sold vehicles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
```

---

## Route Implementation

```javascript
// routes/catSellRoutes.js
const express = require('express');
const router = express.Router();
const catSellController = require('../controllers/catSellController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/catSell - Get all sold vehicles (Admin only)
router.get(
  '/',
  authenticate,
  authorize('adminPanel', 'view'), // Adjust based on your authorization logic
  catSellController.getSoldVehicles
);

module.exports = router;
```

---

## Database Schema Reference

**catSell Collection Schema:**
```javascript
{
  amount: Number (required),
  sellerId: ObjectId (required, ref: 'User'),
  dealerID: String (default: ""), // Empty string for external buyers
  name: String (required),
  email: String (required),
  contact: String (required),
  createdAt: Date (default: Date.now),
  vehicleId: ObjectId (optional, ref: 'Vehicle')
}
```

---

## Search Functionality

The search should match against:
- Buyer `name` (case-insensitive)
- Buyer `email` (case-insensitive)
- Buyer `contact` (case-insensitive)

**Note:** If you want to also search by vehicle title, you'll need to use aggregation pipeline:

```javascript
// Advanced search with vehicle title
if (search) {
  const vehicleSearch = await Vehicle.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ]
  }).select('_id').lean();

  const vehicleIds = vehicleSearch.map(v => v._id);

  searchQuery.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { contact: { $regex: search, $options: 'i' } },
    ...(vehicleIds.length > 0 ? [{ vehicleId: { $in: vehicleIds } }] : [])
  ];
}
```

---

## Security Considerations

1. **Authentication:** Ensure user is authenticated before accessing endpoint
2. **Authorization:** Strictly check for admin/superAdmin role
3. **Input Validation:** Validate and sanitize query parameters
4. **Rate Limiting:** Consider adding rate limiting to prevent abuse
5. **Data Privacy:** Only return necessary fields, don't expose sensitive information

---

## Performance Optimization

1. **Indexes:** Add indexes on frequently queried fields:
   ```javascript
   // In CatSell model
   catSellSchema.index({ createdAt: -1 });
   catSellSchema.index({ name: 'text', email: 'text', contact: 'text' });
   catSellSchema.index({ vehicleId: 1 });
   catSellSchema.index({ sellerId: 1 });
   ```

2. **Pagination Limits:** Enforce maximum limit (e.g., 100 items per page)

3. **Selective Population:** Only populate necessary fields to reduce query time

---

## Testing Checklist

- [ ] Test with admin user - should return data
- [ ] Test with non-admin user - should return 403
- [ ] Test with unauthenticated user - should return 401
- [ ] Test pagination (page 1, 2, etc.)
- [ ] Test with different limit values
- [ ] Test search functionality with name
- [ ] Test search functionality with email
- [ ] Test search functionality with contact
- [ ] Test with empty results
- [ ] Test with invalid page/limit values
- [ ] Verify populated vehicle data
- [ ] Verify populated seller data
- [ ] Verify populated dealer data (when dealerID exists)
- [ ] Verify dealer is null when dealerID is empty string

---

## Example cURL Request

```bash
curl -X GET "http://localhost:3000/api/catSell?page=1&limit=10&search=john" \
  -H "Cookie: your-auth-cookie" \
  -H "Content-Type: application/json"
```

---

## Notes

- The endpoint should be accessible at `/api/catSell` (matching the collection name)
- Ensure proper error handling for database connection issues
- Consider adding caching for frequently accessed data
- Log all access attempts for audit purposes
- The `vehicleId` field in catSell is optional - handle cases where it might not exist

