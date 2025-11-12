'use client';

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Drawer,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  GroupAddOutlined,
  ImportExport,
  ChatBubbleOutline,
  DirectionsCar,
} from '@mui/icons-material';
import { useState } from 'react';
import colors from '@/components/styles';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserTie, FaUser, FaTachometerAlt } from 'react-icons/fa';
import { PiUserListFill } from 'react-icons/pi';
import { RiUserSharedLine } from 'react-icons/ri';
import {
  MdInventory2,
  MdWhatshot,
  MdManageAccounts,
  MdCampaign,
  MdSettingsApplications,
  MdCreditCard,
} from 'react-icons/md';
import usePermission from '@/lib/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openMailing, setOpenMailing] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const hasPermission = usePermission();
  const pathName = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathName === path || pathName?.startsWith(path);
  const isMailingPathActive = pathName.startsWith('/admin/mailing');
  const isUserPathActive =
        pathName === '/admin/customers-list' || pathName === '/admin/dealers-list';
  const navItemStyle = {
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    '&.Mui-selected': {
      backgroundColor: '#c69c6d',
      color: '#fff',
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

  const navItems = [
    {
      label: t('dashboard'),
      icon: <FaTachometerAlt />,
      path: '/admin/dashboard',
      key: 'dashboard',
    },
    {
      label: t('vehicles'),
      icon: <DirectionsCar />,
      path: '/admin/vehicles',
      key: 'vehicles',
      public: true,
    },
    {
      label: t('inventory'),
      icon: <MdInventory2 />,
      path: '/admin/inventory',
      key: 'inventory',
    },
    {
      label: t('hotProducts'),
      icon: <MdWhatshot />,
      path: '/admin/product-list',
      key: 'hotProducts',
    },
    { label: t('crm'), icon: <MdManageAccounts />, path: '/admin/crm', key: 'crm' },
    {
      label: t('community'),
      icon: <RiUserSharedLine />,
      path: '/admin/community',
      key: 'community',
    },
    //{ label: t('ads'), icon: <MdCampaign />, path: '/admin/ads', key: 'ads' },
    {
      label: t('dealersDirectory'),
      icon: <FaUserTie />,
      path: '/admin/dealers',
      key: 'dealersDirectory',
      public: true,
    },
    
    {
      label: t('planBilling'),
      icon: <MdSettingsApplications />,
      path: '/admin/plan-billing',
      key: 'planBilling',
    },
    // {
    //   label: t('subscriptionManage'),
    //   icon: <MdCreditCard />,
    //   path: '/admin/manage-subscription',
    //   key: 'subscriptionManage',
    // },
  ];
  

  // ✅ Add this conditionally
if (user?.role?.roleId === 'admin' || user?.role?.roleId === 'superAdmin') {
  navItems.push({
    label: t('subscriptionManage'),
    icon: <MdCreditCard />,
    path: '/admin/manage-subscription',
    key: 'subscriptionManage',
  });
}

  const mailingSubItems = [
    {
      label: t('importCustomers'),
      icon: <GroupAddOutlined fontSize="small" />,
      path: '/admin/mailing/import',
      key: 'importCustomers',
    },
    {
      label: t('matching'),
      icon: <ImportExport fontSize="small" />,
      path: '/admin/mailing/matching',
      key: 'matching',
    },
  ];
  
  
  const UsersSubItems = [
    {
      label: t('customers'),
      icon: <FaUser />,
      path: '/admin/customers-list',
      key: 'customers',
    },
    { label: t('dealer'), icon: <FaUserTie />, path: '/admin/dealers-list', key: 'dealer' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250, background: colors.background, minHeight: '100vh' }}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="textSecondary" style={{ fontSize: 20 }}>
            {t('adminPanels')}
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map(({ label, icon, path, key, public: isPublic }) => {
            if (!isPublic && !hasPermission('sidebar', key.toLowerCase())) return null;
            return (
              <ListItemButton
                key={label}
                sx={navItemStyle}
                selected={isActive(path)}
                onClick={() => handleNavigate(path)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}

          {/* User Section */}
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
              <PiUserListFill />
            </ListItemIcon>
            <ListItemText primary={t('user')} />
            {openUser ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUser} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {UsersSubItems.map(({ label, icon, path, key }) => {
                if (!hasPermission('sidebar', key.toLowerCase())) return null;
                return (
                  <ListItemButton
                    key={label}
                    sx={{ pl: 6 }}
                    selected={isActive(path)}
                    onClick={() => handleNavigate(path)}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>

          {/* Mailing Section */}
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
              <ChatBubbleOutline />
            </ListItemIcon>
            <ListItemText primary={t('whatsAppMailing')} />
            {openMailing ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMailing} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {mailingSubItems.map(({ label, icon, path }) => (
                <ListItemButton
                  key={label}
                  sx={{ pl: 6 }}
                  selected={isActive(path)}
                  onClick={() => handleNavigate(path)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;

