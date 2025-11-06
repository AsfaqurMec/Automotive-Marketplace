/**
 * Permission Hook - NextDeal Frontend
 *
 * This custom hook provides role-based access control (RBAC) functionality
 * for the NextDeal application. It checks user permissions based on their role
 * and allows or denies access to specific features and modules.
 *
 * Features:
 * - Role-based permission checking
 * - Module and action-based access control
 * - Integration with user authentication
 * - Flexible permission structure
 *
 * Usage:
 * const can = usePermission();
 * const hasAccess = can('adminPanel', 'access');
 *
 * @returns {Function} Permission checking function
 */

import useAuth from './useAuth';
import { User } from '../../types';

const usePermission = () => {
  const auth = useAuth();
  const user = auth && 'user' in auth ? (auth as { user?: User | null }).user : undefined;

  /**
     * Check if user has permission for a specific module and action
     * @param {string} module - The module name (e.g., 'adminPanel', 'vehicles')
     * @param {string} action - The action name (e.g., 'access', 'create', 'edit')
     * @returns {boolean} True if user has permission, false otherwise
     */
  return (module: string, action: string): boolean => {
    const permissions = user?.role?.permissions;

    // Return false if no permissions exist or module doesn't exist
    if (!permissions || !(module in permissions)) return false;

    // Check if the specific action is allowed for the module
    const modulePermissions = permissions[module as keyof typeof permissions];
    return Boolean(modulePermissions && action in modulePermissions && modulePermissions[action as keyof typeof modulePermissions]);
  };
};

export default usePermission;

