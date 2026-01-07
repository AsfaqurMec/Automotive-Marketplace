'use client';

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  GroupAddOutlined,
  ImportExport,
  ChatBubbleOutline,
  Menu as MenuIcon,
  ChevronLeft,
  DirectionsCar,
} from '@mui/icons-material';
import { FaTachometerAlt, FaUser, FaUserTie } from 'react-icons/fa';
import {
  MdInventory2,
  MdWhatshot,
  MdManageAccounts,
  MdCampaign,
  MdSettingsApplications,
  MdCreditCard,
  MdPersonAdd,
  MdSell,
} from 'react-icons/md';
import { RiUserSharedLine } from 'react-icons/ri';
import { PiUserListFill } from 'react-icons/pi';
import { useState } from 'react';
import colors from '@/components/styles';
import { usePathname, useRouter } from 'next/navigation';
import usePermission from '@/lib/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';

const Sidebar: React.FC<{ isSidebarOpen: boolean, handleSidebarToggle: () => void }> = ({ isSidebarOpen, handleSidebarToggle }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openMailing, setOpenMailing] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const hasPermission = usePermission();
  const pathName = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const navItemStyle = {
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    '&.Mui-selected': {
      backgroundColor: '#c69c6d',
      color: 'black',
      '& .MuiListItemIcon-root': {
        color: '#fff',
      },
    },
    '&:hover': {
      '&.Mui-selected': {
        backgroundColor: '#c69c6d',
        color: '#000',
      },
      '& .MuiListItemIcon-root': {
        color: '#000',
      },
    },
  };

  const isActive = (path: string) => pathName === path || pathName?.startsWith(path);
  const isMailingPathActive = pathName.startsWith('/admin/mailing');
  const isUserPathActive =
        pathName === '/admin/customers-list' || pathName === '/admin/dealers-list';

  const navItems = [
    {
      label: t('dashboard'),
      icon: <FaTachometerAlt size={24} />,
      path: '/admin/dashboard',
      key: 'dashboard',
    },
    {
      label: t('vehicles'),
      icon: <DirectionsCar fontSize="inherit" style={{ fontSize: 24 }} />,
      path: '/admin/vehicles',
      key: 'vehicles',
      public: true,
    },
    {
      label: t('inventory'),
      icon: <MdInventory2 size={24} />,
      path: '/admin/inventory',
      key: 'inventory',
    },
    {
      label: t('hotProducts'),
      icon: <MdWhatshot size={24} />,
      path: '/admin/product-list',
      key: 'hotProducts',
    },
    { label: t('crm'), icon: <MdManageAccounts size={24} />, path: '/admin/crm', key: 'crm' },
    {
      label: t('community'),
      icon: <RiUserSharedLine size={24} />,
      path: '/admin/community',
      key: 'community',
    },
    // { label: t('ads'), icon: <MdCampaign size={24} />, path: '/admin/ads', key: 'ads' },
    {
      label: t('dealersDirectory'),
      icon: <FaUserTie size={24} />,
      path: '/admin/dealers',
      key: 'dealersDirectory',
      public: true,
    },
    {
      label: t('Dealer Requests') || 'Dealer Requests',
      icon: <MdPersonAdd size={24} />,
      path: '/admin/dealer-request',
      key: 'dealerRequests',
      public: true,
    },
    
    {
      label: t('planBilling'),
      icon: <MdSettingsApplications size={24} />,
      path: '/admin/plan-billing',
      key: 'planBilling',
    },
    
    // {
    //   label: t('subscriptionManage'),
    //   icon: <MdCreditCard size={24} />,
    //   path: '/admin/manage-subscription',
    //   key: 'subscriptionManage',
    // },
  ];

  // ✅ Add this conditionally
if (user?.role?.roleId === 'admin' || user?.role?.roleId === 'superAdmin') {
  navItems.push({
    label: t('subscriptionManage'),
    icon: <MdCreditCard size={24} />,
    path: '/admin/manage-subscription',
    key: 'subscriptionManage',
    public: true, // Admin only, bypass permission check
  });
  
  // Add Sold Vehicles menu item (admin only)
  navItems.push({
    label: t('Sold Vehicles') || 'Sold Vehicles',
    icon: <MdSell size={24} />,
    path: '/admin/sold-vehicles',
    key: 'soldVehicles',
    public: true, // Admin only, bypass permission check
  });
}

  const mailingSubItems = [
    {
      label: t('importCustomers'),
      icon: <GroupAddOutlined fontSize="inherit" style={{ fontSize: 24 }} />,
      path: '/admin/mailing/import',
      key: 'importCustomers',
    },
    {
      label: t('matching'),
      icon: <ImportExport fontSize="inherit" style={{ fontSize: 24 }} />,
      path: '/admin/mailing/matching',
      key: 'matching',
    },
  ];

  const UsersSubItems = [
    {
      label: t('customers'),
      icon: <FaUser size={24} />,
      path: '/admin/customers-list',
      key: 'customers',
    },
    {
      label: t('dealer'),
      icon: <FaUserTie size={24} />,
      path: '/admin/dealers-list',
      key: 'dealer',
    },
  ];

  return (
    <Box
      sx={{
        background: colors.background,
        minHeight: '100vh',
        width: isSidebarOpen ? (isMobile ? 200 : isTablet ? 200 : 250) : 70,
        transition: 'width 0.3s',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          alignItems: 'center',
          px: 2,
          py: 1,
        }}
      >
        {isSidebarOpen && (
          <Typography variant="caption" color="textSecondary">
                        Menu
          </Typography>
        )}
        <IconButton onClick={handleSidebarToggle} size="small">
          {isSidebarOpen ? <ChevronLeft fontSize="inherit" style={{ fontSize: 24 }} /> : <MenuIcon fontSize="inherit" style={{ fontSize: 24 }} />}
        </IconButton>
      </Box>

      <Divider />

      <List>
        {/* Simple nav items */}
        {navItems.map(({ label, icon, path, key, public: isPublic }) => {
          if (!isPublic && !hasPermission('sidebar', key.toLowerCase().replace(/\s/g, '')))
            return null;
          return (
            <ListItemButton
              key={label}
              sx={navItemStyle}
              selected={isActive(path)}
              onClick={() => router.push(path)}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              {isSidebarOpen && <ListItemText primary={label} />}
            </ListItemButton>
          );
        })}

        {/* USER section */}
        { hasPermission('sidebar', 'dealer') && (
          <ListItemButton
            sx={{
              ...navItemStyle,

              ...(isUserPathActive && {
                backgroundColor: '#c69c6d',
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: '#c69c6d',
                  color: '#000',

                  '& .MuiListItemIcon-root': {
                    color: '#000',
                  },
                },
              }),
            }}
            onClick={() => setOpenUser(!openUser)}
          >
            <ListItemIcon>
              <PiUserListFill size={24} />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary={t('user')} />}
            {isSidebarOpen && (openUser ? <ExpandLess fontSize="inherit" style={{ fontSize: 24 }} /> : <ExpandMore fontSize="inherit" style={{ fontSize: 24 }} />)}
          </ListItemButton>
        )}

        <Collapse in={openUser && isSidebarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {UsersSubItems.map(({ label, icon, path, key }) => {
              if (!hasPermission('sidebar', key.toLowerCase())) return null;
              return (
                <ListItemButton
                  key={label}
                  sx={{ pl: 6 }}
                  selected={isActive(path)}
                  onClick={() => router.push(path)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>

        {/* WhatsApp Mailing */}
        <ListItemButton
          sx={{
            ...navItemStyle,

            ...(isMailingPathActive && {
              backgroundColor: '#c69c6d',
              color: '#fff',
              '& .MuiListItemIcon-root': {
                color: '#fff',
              },
              '&:hover': {
                backgroundColor: '#c69c6d',
                color: '#000',

                '& .MuiListItemIcon-root': {
                  color: '#000',
                },
              },
            }),
          }}
          onClick={() => setOpenMailing(!openMailing)}
        >
          <ListItemIcon>
            <ChatBubbleOutline fontSize="inherit" style={{ fontSize: 24 }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary={t('whatsAppMailing')} />}
          {isSidebarOpen && (openMailing ? <ExpandLess fontSize="inherit" style={{ fontSize: 24 }} /> : <ExpandMore fontSize="inherit" style={{ fontSize: 24 }} />)}
        </ListItemButton>

        <Collapse in={openMailing && isSidebarOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {mailingSubItems.map(({ label, icon, path }) => (
              <ListItemButton
                key={label}
                sx={{ pl: 6 }}
                selected={isActive(path)}
                onClick={() => router.push(path)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;

