import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface UserPermissions {
  [group: string]: {
    [permission: string]: boolean;
  };
}

interface UserRole {
  permissions?: UserPermissions;
  [key: string]: unknown;
}

interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  role?: UserRole;
  [key: string]: unknown;
}

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: UserData;
  onSave: (data: UserData) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<UserData>({});

  useEffect(() => {
    setFormData(user || {});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [group, perm] = name.split('.');
      setFormData((prev: UserData) => ({
        ...prev,
        role: {
          ...prev.role,
          permissions: {
            ...prev.role?.permissions,
            [group]: {
              ...prev.role?.permissions?.[group],
              [perm]: checked,
            },
          },
        },
      }));
    } else {
      setFormData((prev: UserData) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Gender"
          name="gender"
          value={formData.gender || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isBlocked || false}
              onChange={handleChange}
              name="isBlocked"
            />
          }
          label="Blocked"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isEmailVerified || false}
              onChange={handleChange}
              name="isEmailVerified"
            />
          }
          label="Email Verified"
        />

        {/* <Box mt={2}>
          <Typography variant="h6" gutterBottom>Permissions</Typography>
          {formData.role?.permissions &&
            Object.entries(formData.role.permissions).map(([groupName, perms]) =>
              renderPermissionGroup(groupName, perms)
            )}
        </Box> */}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
                    Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditModal;

