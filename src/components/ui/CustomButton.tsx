/**
 * CustomButton Component - NextDeal Frontend
 *
 * A reusable button component that provides consistent styling and behavior
 * across the NextDeal application. It extends Material-UI's Button component
 * with custom styling and responsive design.
 *
 * Features:
 * - Responsive design with different sizes for mobile and desktop
 * - Consistent typography using Rubik font family
 * - Brand color scheme integration
 * - Hover effects and disabled states
 * - Customizable styling through props
 *
 * @param {ReactNode} children - Button content (text, icons, etc.)
 * @param {Function} onClick - Click event handler function
 * @param {boolean} fullWidth - Whether button should take full width (default: true)
 * @param {boolean} disabled - Whether button is disabled (default: false)
 * @param {Object} etcStyle - Additional custom styles to apply
 */

import React from 'react';
import { Button } from '@mui/material';
import colors from '../styles';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  etcStyle?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  etcStyle = {},
  disabled = false,
  type = 'button',
  fullWidth = true,
}) => {
  const whitetext = colors.white;

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      sx={{
        backgroundColor: colors.primary,
        color: whitetext,
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '12px 24px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: colors.primary,
          opacity: 0.9,
        },
        ...etcStyle,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

