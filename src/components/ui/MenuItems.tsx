import React from 'react';

interface MenuItemsProps {
  menuItems: string[];
  onMenuClick?: (menu: string) => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ menuItems, onMenuClick }) => {
  const handleClick = (event: React.MouseEvent, menuItem: string) => {
    event.preventDefault();
    if (onMenuClick) {
      onMenuClick(menuItem);
    }
  };

  return (
    <div>
      {menuItems.map((menuItem, index) => (
        <div key={index} onClick={(event) => handleClick(event, menuItem)}>
          {menuItem}
        </div>
      ))}
    </div>
  );
};

export default MenuItems;

