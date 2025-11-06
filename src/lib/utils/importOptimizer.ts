/**
 * Import Optimizer - NextDeal Frontend
 *
 * Utility to help with tree-shakeable imports and bundle optimization.
 * Provides optimized import patterns for common libraries.
 *
 * Features:
 * - Tree-shakeable Material-UI imports
 * - Optimized icon imports
 * - Bundle size monitoring
 * - Import analysis utilities
 */

// Material-UI optimized imports
export const muiComponents = {
  // Layout components
  Box: () => import('@mui/material/Box'),
  Container: () => import('@mui/material/Container'),
  Grid: () => import('@mui/material/Grid'),
  Paper: () => import('@mui/material/Paper'),

  // Form components
  Button: () => import('@mui/material/Button'),
  TextField: () => import('@mui/material/TextField'),
  Select: () => import('@mui/material/Select'),
  Checkbox: () => import('@mui/material/Checkbox'),
  Radio: () => import('@mui/material/Radio'),
  Switch: () => import('@mui/material/Switch'),

  // Display components
  Typography: () => import('@mui/material/Typography'),
  Card: () => import('@mui/material/Card'),
  CardContent: () => import('@mui/material/CardContent'),
  CardMedia: () => import('@mui/material/CardMedia'),
  Avatar: () => import('@mui/material/Avatar'),

  // Navigation components
  AppBar: () => import('@mui/material/AppBar'),
  Toolbar: () => import('@mui/material/Toolbar'),
  Menu: () => import('@mui/material/Menu'),
  MenuItem: () => import('@mui/material/MenuItem'),
  Breadcrumbs: () => import('@mui/material/Breadcrumbs'),

  // Feedback components
  Alert: () => import('@mui/material/Alert'),
  Snackbar: () => import('@mui/material/Snackbar'),
  Dialog: () => import('@mui/material/Dialog'),
  DialogTitle: () => import('@mui/material/DialogTitle'),
  DialogContent: () => import('@mui/material/DialogContent'),
  DialogActions: () => import('@mui/material/DialogActions'),

  // Data display components
  Table: () => import('@mui/material/Table'),
  TableBody: () => import('@mui/material/TableBody'),
  TableCell: () => import('@mui/material/TableCell'),
  TableContainer: () => import('@mui/material/TableContainer'),
  TableHead: () => import('@mui/material/TableHead'),
  TableRow: () => import('@mui/material/TableRow'),

  // Lab components
  DatePicker: () => import('@mui/x-date-pickers/DatePicker'),
  TimePicker: () => import('@mui/x-date-pickers/TimePicker'),
};

// Icon imports (only import what you need)
export const muiIcons = {
  // Navigation icons
  Menu: () => import('@mui/icons-material/Menu'),
  Close: () => import('@mui/icons-material/Close'),
  ArrowBack: () => import('@mui/icons-material/ArrowBack'),
  ArrowForward: () => import('@mui/icons-material/ArrowForward'),

  // Action icons
  Add: () => import('@mui/icons-material/Add'),
  Edit: () => import('@mui/icons-material/Edit'),
  Delete: () => import('@mui/icons-material/Delete'),
  Search: () => import('@mui/icons-material/Search'),
  FilterList: () => import('@mui/icons-material/FilterList'),

  // Communication icons
  Email: () => import('@mui/icons-material/Email'),
  Phone: () => import('@mui/icons-material/Phone'),
  Message: () => import('@mui/icons-material/Message'),
  Notifications: () => import('@mui/icons-material/Notifications'),

  // Social icons
  Facebook: () => import('@mui/icons-material/Facebook'),
  Twitter: () => import('@mui/icons-material/Twitter'),
  Instagram: () => import('@mui/icons-material/Instagram'),
  LinkedIn: () => import('@mui/icons-material/LinkedIn'),

  // Vehicle icons
  DirectionsCar: () => import('@mui/icons-material/DirectionsCar'),
  LocalGasStation: () => import('@mui/icons-material/LocalGasStation'),
  Build: () => import('@mui/icons-material/Build'),
  LocationOn: () => import('@mui/icons-material/LocationOn'),
};

/**
 * Bundle size analyzer utility
 */
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private importSizes: Map<string, number> = new Map();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  /**
   * Track import size
   */
  trackImport(moduleName: string, size: number): void {
    this.importSizes.set(moduleName, size);
  }

  /**
   * Get bundle analysis report
   */
  getReport(): { moduleName: string; size: number }[] {
    return Array.from(this.importSizes.entries())
      .map(([moduleName, size]) => ({ moduleName, size }))
      .sort((a, b) => b.size - a.size);
  }

  /**
   * Get total bundle size
   */
  getTotalSize(): number {
    return Array.from(this.importSizes.values()).reduce((sum, size) => sum + size, 0);
  }

  /**
   * Get largest imports
   */
  getLargestImports(count: number = 10): { moduleName: string; size: number }[] {
    return this.getReport().slice(0, count);
  }
}

/**
 * Import optimization recommendations
 */
export const getImportRecommendations = (): string[] => {
  const recommendations = [
    'Use dynamic imports for large components that are not immediately needed',
    'Import only specific icons instead of entire icon libraries',
    'Use tree-shakeable imports for Material-UI components',
    'Consider code splitting for route-based components',
    'Lazy load images and media content',
    'Use React.lazy() for component-level code splitting',
    'Implement virtual scrolling for large lists',
    'Optimize third-party library usage',
  ];

  return recommendations;
};

/**
 * Check if import is tree-shakeable
 */
export const isTreeShakeable = (importPath: string): boolean => {
  const treeShakeablePatterns = [
    /^@mui\/material\/[^/]+$/, // Individual MUI components
    /^@mui\/icons-material\/[^/]+$/, // Individual MUI icons
    /^lodash\/[^/]+$/, // Individual lodash functions
    /^date-fns\/[^/]+$/, // Individual date-fns functions
  ];

  return treeShakeablePatterns.some(pattern => pattern.test(importPath));
};

const importOptimizer = {
  muiComponents,
  muiIcons,
  BundleAnalyzer,
  getImportRecommendations,
  isTreeShakeable,
};

export default importOptimizer;

