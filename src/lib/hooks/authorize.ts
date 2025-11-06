import { toast } from 'react-toastify';

interface UserRole {
    permissions: {
        [module: string]: {
            [action: string]: boolean;
        };
    };
}

interface User {
    role?: UserRole;
    // add other user properties as needed
}

export const authorize = async (user: User, module: string, action: string) => {
  try {
    const hasPermission = user?.role?.permissions?.[module]?.[action];

    if (!hasPermission) {
      throw new Error(`Unauthorized: Missing permission for ${module}.${action}`);
    }
  } catch (error) {
    toast.error('Unauthorization missing permission!');
    throw error;
  }
};

