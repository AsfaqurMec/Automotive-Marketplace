// /**
//  * ResponsiveAppBar Component - NextDeal Frontend
//  *
//  * The main navigation bar component for the NextDeal application.
//  * It provides responsive navigation, user authentication status,
//  * language switching, and role-based menu items.
//  *
//  * Features:
//  * - Responsive design for mobile, tablet, and desktop
//  * - User authentication status display
//  * - Language switching (English/Hebrew/Bengali with RTL support)
//  * - Role-based navigation menu items
//  * - User profile and logout functionality
//  * - Real-time user data updates
//  * - Permission-based admin panel access
//  */

// 'use client';
// import React, { useState, useEffect, useCallback } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
// import colors from '../styles';
// import {
//   MenuItem,
//   Link,
//   Popper,
//   Paper,
//   ClickAwayListener,
//   List,
//   ListItemButton,
//   ListItemText,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import logo from '@/assets/navbarLogo.png';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useRouter } from 'next/navigation';
// import CustomLoaderForComponent from '../ui/CustomLoaderForComponent';
// import { useCurrency } from '@/lib/hooks/CurrencyProvider';
// import useAuth from '@/lib/hooks/useAuth';
// import i18n from '@/i18n';
// import usePermission from '@/lib/hooks/usePermission';
// import { useTranslation } from 'react-i18next';
// import { removeUserGlobally } from '@/lib/utils/updateUser';

// interface Setting {
//     label: string;
//     path: string;
//     onClick?: () => void;
// }

// interface UserData {
//     _id?: string;
//     authenticated?: boolean;
//     fullName?: string;
//     email?: string;
//     profileImage?: string;
//     user?: UserData;
// }

// export let clearNavbarUserData: () => void = () => {};

// function ResponsiveAppBar(): React.JSX.Element {
//   const theme = useTheme();0
//   const can = usePermission();
//   const { user, refetchUser, isLoading, logout, setUser, setIsLoading} = useAuth();

//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [open, setOpen] = useState<boolean>(false);

//   const router = useRouter();
//   const isMd = useMediaQuery(theme.breakpoints.down('md'));
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true for xs and sm
//   const { t } = useTranslation();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [hasMounted, setHasMounted] = useState<boolean>(false);
//   const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
//   const { currency, setCurrency } = useCurrency();
//   // User data available
//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   // Add this to make update triggerable
//   useEffect(() => {
//     const handleUpdateUserData = (event: CustomEvent) => {
//       setUserData(event.detail);
//     };

//     window.addEventListener('update-userData', handleUpdateUserData as EventListener);
//     return () => window.removeEventListener('update-userData', handleUpdateUserData as EventListener);
//   }, []);

//   useEffect(() => {
//     if (!user?._id) return;

//     const token = sessionStorage.getItem('user-status');
//     const fromLogin = sessionStorage.getItem('fromLogin');
//     // if(fromLogin === 'true') {
//     //   setUserData(user);
//     //   return;
//     // }
//     if (token === 'true') {
//       const timer = setTimeout(() => {
//         setUserData(user);
//         sessionStorage.setItem('user-status', 'false');
//         sessionStorage.setItem('fromLogin', 'true');
//       }, 2400);
//       return () => clearTimeout(timer);
//     }
//   },[user]);

//   // Expose this function so other components can call it
//   clearNavbarUserData = () => {
//     setUserData(null);
//   };

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//     setOpen((prev) => !prev);
//   };

//   const handleClose = (lang?: string) => {
//     if (lang) {
//       const langCode =
//                 lang === 'English'
//                   ? 'en'
//                   : lang === 'Spanish'
//                     ? 'es'
//                     : lang === 'Hebrew'
//                       ? 'he'
//                       : lang === 'Bengali'
//                         ? 'bn'
//                         : 'en';

//       i18n.changeLanguage(langCode);

//       document.documentElement.dir = langCode === 'he' ? 'rtl' : 'ltr';
//     }
//     setAnchorEl(null);

//     setOpen(false);
//   };
//   const textColor = colors.text;
//   const bgColor = colors.background;
//   const white = colors.white;
//   const gray1 = colors.gray1;
//   const textBlack = colors.textBlack;

//   const style = {
//     color: textBlack,
//     fontFamily: 'Rubik',
//     fontSize: isMobile ? '20px' : isMd ? '20px' : '23.815px',
//     fontStyle: 'normal' as const,
//     fontWeight: 600,
//     lineHeight: 'normal',
//   };

//   const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElUser(event.currentTarget);
//   }, []);

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       setAnchorElUser(null);
//       setUserData(null);
//       removeUserGlobally();
//       setUser(null);
//       logout();
//       // Add a minimum delay to ensure loading screen is visible
//       // const [logoutResult] = await Promise.all([
//       //   logout(),
//       //   new Promise(resolve => setTimeout(resolve, 2500)),
//       // ]);
//       router.push('/signin');
//     } catch {
//       // Still redirect even if logout fails
//       router.push('/signin');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   // useEffect(() => {
//   //   setIsLoading(true);
//   //   refetchUser();
//   // }, [refetchUser, setIsLoading]);
//   useEffect(() => {
//     if (user?._id) {
//       setIsLoading(true);
//       refetchUser();
//     }
//   }, [user?._id, refetchUser, setIsLoading]);

//   const settings: Setting[] = [];

//   if (user && user.authenticated !== false) {
//     settings.push({ label: t('home'), path: '/' }, { label: t('profile'), path: '/profile' });

//     if (can('adminPanel', 'access')) {
//       settings.push({ label: t('adminPanel'), path: '/admin/dashboard' });
//     }

//     settings.push({
//       label: t('logout'),
//       path: '/signin',
//       onClick: handleLogout,
//     });
//   }

//   return (
//     <>
//       {(isLoading || isLoggingOut) && <CustomLoaderForComponent />}
//       <AppBar
//         position="static"
//         sx={{
//           maxHeight: { xs: '70px', md: '80px', lg: '96px' },
//           justifyContent: 'center',
//           alignItems: 'center',
//           display: 'flex',
//           boxShadow: 'none',
//           borderBottom: '1px solid #E0E0E0',
//           border: 0,
//           backgroundColor: white,
//           zIndex: 105,
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ display: 'flex' }}>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'start',
//                 alignItems: 'center',
//                 width: '100%',
//               }}
//             >
//               <Box
//                 display="flex"
//                 sx={{ justifyContent: 'end' }}
//                 alignItems="center"
//                 gap={2}
//               >
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <Box
//                     component="img"
//                     src={logo?.src}
//                     alt="logo"
//                     sx={{
//                       width: {
//                         xs: '20px', // for extra small (mobile) screens
//                         sm: '25px', // for small screens
//                         md: '30px', // for medium and up
//                       },
//                       height: {
//                         xs: '20px',
//                         sm: '25px',
//                         md: '30px',
//                       },
//                     }}
//                   />
//                   {user != null && user?.authenticated != false ? (
//                     <Link
//                       href="/admin/dashboard"
//                       underline="none"
//                       sx={{ textDecoration: 'none', cursor: 'pointer' }}
//                     >
//                       <Typography variant="h6" fontWeight="bold" sx={style}>
//                                                 NextDeal
//                       </Typography>
//                     </Link>
//                   ) : (
//                     <Link
//                       href="/"
//                       underline="none"
//                       sx={{ textDecoration: 'none', cursor: 'pointer' }}
//                     >
//                       <Typography variant="h6" fontWeight="bold" sx={style}>
//                                                 NextDeal
//                       </Typography>
//                     </Link>
//                   )}
//                 </Box>
//               </Box>
//               <Box sx={{ flexGrow: 0, justifyContent: 'end' }}>
//                 <Menu
//                   sx={{ mt: '45px' }}
//                   id="menu-appbar"
//                   anchorEl={anchorElUser}
//                   anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   keepMounted
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   open={Boolean(anchorElUser)}
//                   onClose={handleCloseUserMenu}
//                 >
//                   {settings.map((setting) => (
//                     <MenuItem
//                       key={setting.label}
//                       onClick={() => {
//                         if (setting.label === t('logout')) {
//                           handleLogout();
//                         } else {
//                           setAnchorElUser(null);
//                           router.push(setting.path);
//                         }
//                       }}
//                     >
//                       <Typography sx={{ textAlign: 'center' }}>
//                         {setting.label}
//                       </Typography>
//                     </MenuItem>
//                   ))}
//                 </Menu>
//               </Box>
//               {/* Currency Switcher */}
//               {/* <Box
//                 sx={{
//                   cursor: 'pointer',
//                   display: 'flex',
//                   gap: 1,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   borderRadius: '5px',
//                   padding: isMobile ? '1px 8px' : '5px 10px',
//                   backgroundColor: bgColor,
//                   color: textColor,
//                   zIndex: 100,
//                   mr: 1,
//                 }}
//               >
//                 <Typography
//                   onClick={(e) => {
//                     // Simple rotate: USD -> BDT -> INR -> USD
//                     const next = currency === 'USD' ? 'BDT' : currency === 'BDT' ? 'INR' : 'USD';
//                     setCurrency(next);
//                   }}
//                   sx={{ fontWeight: 600 }}
//                 >
//                   {currency}
//                 </Typography>
//               </Box> */}
//               {/* <Box
//                 onClick={handleClick}
//                 sx={{
//                   cursor: 'pointer',
//                   display: 'flex',
//                   gap: isMobile ? 0 : 1,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   borderRadius: '5px',
//                   padding: isMobile ? '1px 10px' : '5px 10px',
//                   backgroundColor: bgColor,
//                   color: textColor,
//                   zIndex: 100,
//                 }}
//               >
//                 {hasMounted && <Typography>{i18n?.language}</Typography>}{' '}
//                 <ExpandMoreIcon />
//                 <Popper
//                   open={Boolean(open && anchorEl)}
//                   anchorEl={anchorEl}
//                   placement="bottom-start"
//                 >
//                   <ClickAwayListener onClickAway={() => handleClose()}>
//                     <Paper sx={{ width: 150, mt: 1, boxShadow: 3 }}>
//                       <List>
//                         <ListItemButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleClose('English');
//                           }}
//                         >
//                           <ListItemText primary="English" />
//                         </ListItemButton>

//                         <ListItemButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleClose('Hebrew');
//                           }}
//                         >
//                           <ListItemText primary="Hebrew" />
//                         </ListItemButton>

//                         <ListItemButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleClose('Bengali');
//                           }}
//                         >
//                           <ListItemText primary="Bengali" />
//                         </ListItemButton>
//                       </List>
//                     </Paper>
//                   </ClickAwayListener>
//                 </Popper>
//               </Box> */}
//             </Box>
//             {userData != null && userData?.authenticated != false ? (
//               <>
//                 <Box
//                   sx={{
//                     flexGrow: 1,
//                     display: { xs: 'none', sm: 'flex' },
//                     gap: 4,
//                     mx: 2,
//                   }}
//                 >
//                   {/* <IconButton>
//                         <Typography
//                             sx={{
//                                 mr: 1,
//                                 display:  'flex' ,
//                                 fontFamily: 'Rubik',
//                                 fontWeight: 400,
//                                 fontSize:  isMd ? '14px' : '18px',
//                                 color: textColor,
//                                 gap: 1,
//                                 justifyContent: 'center',
//                                 alignItems: 'center'
//                             }}
//                         >
//                             <FavoriteBorderSharpIcon />
//                             {t('waitList')}
//                         </Typography>
//                     </IconButton> */}

//                   <IconButton onClick={() => router.push('/chat')}>
//                     <Typography
//                       sx={{
//                         mr: 1,
//                         display: 'flex',
//                         fontFamily: 'Rubik',
//                         fontWeight: 400,
//                         fontSize: isMd ? '14px' : '18px',
//                         color: textColor,
//                         gap: 1,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <SpeakerNotesOutlinedIcon />
//                       {t('chat')}
//                     </Typography>
//                   </IconButton>
//                   {/* <IconButton sx={{ display: { md: 'flex' } }}>
//                         <NotificationsNoneOutlinedIcon sx={{ mr: 1,ml:3 }} />
//                     </IconButton> */}
//                 </Box>

//                 <Box
//                   onClick={handleOpenUserMenu}
//                   sx={{
//                     cursor: 'pointer',
//                     display: { xs: 'none', md: 'flex' },
//                     gap: 1,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flexDirection: 'row',
//                     borderRadius: '5px',
//                     padding: '5px 10px',
//                     backgroundColor: bgColor,
//                     color: textColor,
//                     marginRight: 2,
//                   }}
//                 >
//                   <ExpandMoreIcon />
//                 </Box>
//                 <Box
//                   //variant="h6"
//                   sx={{
//                     mx: 2,
//                     display: { xs: 'none', md: 'flex' },
//                     flexDirection: 'column',
//                     gap: 1,
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       letterSpacing: '.3rem',
//                       textDecoration: 'none',
//                       fontSize: '0.9rem',
//                       fontFamily: 'Rubik',
//                       fontWeight: 500,
//                       textColor: textColor,
//                       color: textColor,
//                     }}
//                   >
//                     {userData?.fullName?.slice(0, 15) || userData?.user?.fullName?.slice(0, 15)}
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontFamily: 'monospace',
//                       fontWeight: 700,
//                       letterSpacing: '.3rem',
//                       textDecoration: 'none',
//                       color: gray1,
//                       fontSize: '14px',
//                       fontStyle: 'normal',
//                       lineHeight: 'normal',
//                     }}
//                   >
//                     {userData?.email || userData?.user?.email}
//                   </Typography>
//                 </Box>
//                 <Tooltip title="Open settings">
//                   <IconButton sx={{ p: 0 }}>
//                     <Avatar
//                       onClick={(e) => {
//                         if (isMobile || isMd) {
//                           handleOpenUserMenu(e);
//                         }
//                       }}
//                       alt="Remy Sharp"
//                       src={userData?.profileImage || userData?.user?.profileImage}
//                       sx={{ borderRadius: '5%' }}
//                     />
//                   </IconButton>
//                 </Tooltip>
//               </>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     gap: isMobile ? 0.5 : 2,
//                     marginLeft: isMobile ? 1 : 0,
//                   }}
//                 >
//                   <Link href="/signin">
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       sx={{
//                         textTransform: 'none',
//                         fontWeight: 500,
//                         fontSize: isMobile ? '12px' : '16px',
//                         borderRadius: '8px',
//                         px: isMobile ? 0 : 3,
//                         py: 1,
//                         '&:hover': {
//                           backgroundColor: 'rgba(21, 101, 192, 0.04)',
//                         },
//                       }}
//                     >
//                       {t('login')}
//                     </Button>
//                   </Link>
//                   <Link href="/signup">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       sx={{
//                         textTransform: 'none',
//                         fontWeight: 500,
//                         fontSize: isMobile ? '12px' : '16px',
//                         borderRadius: '8px',
//                         px: isMobile ? 0 : 3,
//                         py: 1,
//                         backgroundColor: '#1976d2',
//                         '&:hover': {
//                           backgroundColor: '#1565c0',
//                         },
//                       }}
//                     >
//                       {t('register')}
//                     </Button>
//                   </Link>
//                 </Box>
//               </>
//             )}
//           </Toolbar>
//         </Container>
//       </AppBar>{' '}
//     </>
//   );
// }

// export default ResponsiveAppBar;

/**
 * ResponsiveAppBar Component - NextDeal Frontend
 *
 * The main navigation bar component for the NextDeal application.
 * It provides responsive navigation, user authentication status,
 * language switching, and role-based menu items.
 *
 * Features:
 * - Responsive design for mobile, tablet, and desktop
 * - User authentication status display
 * - Language switching (English/Hebrew with RTL support)
 * - Role-based navigation menu items
 * - User profile and logout functionality
 * - Real-time user data updates
 * - Permission-based admin panel access
 */

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import colors from '../styles';
import {
  MenuItem,
  Link,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import logo from '@/assets/navbarLogo.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import i18n from '@/i18n';
import usePermission from '@/lib/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import { removeUserGlobally } from '@/lib/utils/updateUser';

interface Setting {
    label: string;
    path: string;
    onClick?: () => void;
}

interface UserData {
    _id?: string;
    authenticated?: boolean;
    fullName?: string;
    email?: string;
    profileImage?: string;
    user?: UserData;
}

export let clearNavbarUserData: () => void = () => {};

function ResponsiveAppBar(): React.JSX.Element {
  const theme = useTheme();
  const can = usePermission();
  const { user, refetchUser, isLoading, logout, setIsLoading, isLoggingOut } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true for xs and sm
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  // User data available
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Add this to make update triggerable
  useEffect(() => {
    const handleUpdateUserData = (event: CustomEvent) => {
      setUserData(event.detail);
    };

    window.addEventListener('update-userData', handleUpdateUserData as EventListener);
    return () => window.removeEventListener('update-userData', handleUpdateUserData as EventListener);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const token = sessionStorage.getItem('user-status');
    const fromLogin = sessionStorage.getItem('fromLogin');
    if(fromLogin === 'true') {
      setUserData(user);
      return;
    }
    if (token === 'true') {
      const timer = setTimeout(() => {
        setUserData(user);
        sessionStorage.setItem('user-status', 'false');
        sessionStorage.setItem('fromLogin', 'true');
      }, 2400);
      return () => clearTimeout(timer);
    }
  },[user]);

  // Expose this function so other components can call it
  clearNavbarUserData = () => {
    setUserData(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = (lang?: string) => {
    if (lang) {
      const langCode =
                lang === 'English'
                  ? 'en'
                  : lang === 'Spanish'
                    ? 'es'
                    : lang === 'Hebrew'
                      ? 'he'
                      : 'en';

      i18n.changeLanguage(langCode);

      document.documentElement.dir = langCode === 'he' ? 'rtl' : 'ltr';
    }
    setAnchorEl(null);

    setOpen(false);
  };
  const textColor = colors.text;
  const bgColor = colors.background;
  const white = colors.white;
  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;

  const style = {
    color: textBlack,
    fontFamily: 'Rubik',
    fontSize: isMobile ? '20px' : isMd ? '20px' : '23.815px',
    fontStyle: 'normal' as const,
    fontWeight: 600,
    lineHeight: 'normal',
  };

  const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      setAnchorElUser(null);
      setUserData(null);
      removeUserGlobally();
      // logout() will set isLoggingOut to true
      await logout();
      router.push('/signin');
      // isLoggingOut will be cleared when navigation completes in ClientLayout
    } catch {
      // Still redirect even if logout fails
      router.push('/signin');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    refetchUser();
  }, [refetchUser, setIsLoading]);

  const settings: Setting[] = [];

  if (user && user.authenticated !== false) {
    settings.push({ label: t('Home'), path: '/admin/dashboard' }, { label: t('My profile'), path: `/admin/dealer/${user?._id}` }, { label: t('Shared profile'), path: `/profile` });

    if (can('adminPanel', 'access')) {
      settings.push({ label: t('adminPanel'), path: '/admin/dashboard' });
    }

    settings.push({
      label: t('logout'),
      path: '/signin',
      onClick: handleLogout,
    });
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          maxHeight: { xs: '70px', md: '80px', lg: '96px' },
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          boxShadow: 'none',
          borderBottom: '1px solid #E0E0E0',
          border: 0,
          backgroundColor: white,
          zIndex: 105,
        }}
      >
        <Container maxWidth="xl" sx={{ borderBottom: '1px solid #E0E0E0' }}>
          <Toolbar disableGutters sx={{ display: 'flex' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box
                display="flex"
                sx={{ justifyContent: 'end' }}
                alignItems="center"
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    component="img"
                    src={logo?.src}
                    alt="logo"
                    sx={{
                      width: {
                        xs: '20px', // for extra small (mobile) screens
                        sm: '25px', // for small screens
                        md: '30px', // for medium and up
                      },
                      height: {
                        xs: '20px',
                        sm: '25px',
                        md: '30px',
                      },
                    }}
                  />
                  {user != null && user?.authenticated != false ? (
                    <Link
                      href="/admin/dashboard"
                      underline="none"
                      sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <Typography variant="h6" fontWeight="bold" sx={style}>
                                                NextDeal
                      </Typography>
                    </Link>
                  ) : (
                    <Link
                      href="/"
                      underline="none"
                      sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <Typography variant="h6" fontWeight="bold" sx={style}>
                                                NextDeal
                      </Typography>
                    </Link>
                  )}
                </Box>
              </Box>
              <Box sx={{ flexGrow: 0, justifyContent: 'end' }}>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.label}
                      onClick={() => {
                        if (setting.label === t('logout')) {
                          handleLogout();
                        } else {
                          setAnchorElUser(null);
                          router.push(setting.path);
                        }
                      }}
                    >
                      <Typography sx={{ textAlign: 'center' }}>
                        {setting.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              {/* <Box
                onClick={handleClick}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  gap: isMobile ? 0 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  borderRadius: '5px',
                  padding: isMobile ? '1px 10px' : '5px 10px',
                  backgroundColor: bgColor,
                  color: textColor,
                  zIndex: 100,
                }}
              >
                {hasMounted && <Typography>{i18n?.language}</Typography>}{' '}
                <ExpandMoreIcon />
                <Popper
                  open={Boolean(open && anchorEl)}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                >
                  <ClickAwayListener onClickAway={() => handleClose()}>
                    <Paper sx={{ width: 150, mt: 1, boxShadow: 3 }}>
                      <List>
                        <ListItemButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose('English');
                          }}
                        >
                          <ListItemText primary="English" />
                        </ListItemButton>

                        <ListItemButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose('Hebrew');
                          }}
                        >
                          <ListItemText primary="Hebrew" />
                        </ListItemButton>
                      </List>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box> */}
            </Box>
            {userData != null && userData?.authenticated != false ? (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: 'none', sm: 'flex' },
                    gap: 4,
                    mx: 2,
                  }}
                >
                  {/* <IconButton>
                        <Typography
                            sx={{
                                mr: 1,
                                display:  'flex' ,
                                fontFamily: 'Rubik',
                                fontWeight: 400,
                                fontSize:  isMd ? '14px' : '18px',
                                color: textColor,
                                gap: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <FavoriteBorderSharpIcon />
                            {t('waitList')}
                        </Typography>
                    </IconButton> */}

                  <IconButton onClick={() => router.push('/chat')}>
                    <Typography
                      sx={{
                        mr: 1,
                        display: 'flex',
                        fontFamily: 'Rubik',
                        fontWeight: 400,
                        fontSize: isMd ? '14px' : '18px',
                        color: textColor,
                        gap: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <SpeakerNotesOutlinedIcon />
                      {t('chat')}
                    </Typography>
                  </IconButton>
                  {/* <IconButton sx={{ display: { md: 'flex' } }}>
                        <NotificationsNoneOutlinedIcon sx={{ mr: 1,ml:3 }} />
                    </IconButton> */}
                </Box>

                <Box
                  onClick={handleOpenUserMenu}
                  sx={{
                    cursor: 'pointer',
                    display: { xs: 'none', md: 'flex' },
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    backgroundColor: bgColor,
                    color: textColor,
                    marginRight: 2,
                  }}
                >
                  <ExpandMoreIcon />
                </Box>
                <Box
                  //variant="h6"
                  sx={{
                    mx: 2,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      letterSpacing: '.3rem',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontFamily: 'Rubik',
                      fontWeight: 500,
                      textColor: textColor,
                      color: textColor,
                    }}
                  >
                    {userData?.fullName?.slice(0, 15) || userData?.user?.fullName?.slice(0, 15)}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      textDecoration: 'none',
                      color: gray1,
                      fontSize: '14px',
                      fontStyle: 'normal',
                      lineHeight: 'normal',
                    }}
                  >
                    {userData?.email || userData?.user?.email}
                  </Typography>
                </Box>
                <Tooltip title="Open settings">
                  <IconButton sx={{ p: 0 }}>
                    <Avatar
                      onClick={(e) => {
                        if (isMobile || isMd) {
                          handleOpenUserMenu(e);
                        }
                      }}
                      alt="Remy Sharp"
                      src={userData?.profileImage || userData?.user?.profileImage}
                      sx={{ borderRadius: '5%' }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    gap: isMobile ? 0.5 : 2,
                    marginLeft: isMobile ? 1 : 0,
                  }}
                >
                  <Link href="/signin">
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: isMobile ? '12px' : '16px',
                        borderRadius: '8px',
                        px: isMobile ? 0 : 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(21, 101, 192, 0.04)',
                        },
                      }}
                    >
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: isMobile ? '12px' : '16px',
                        borderRadius: '8px',
                        px: isMobile ? 0 : 3,
                        py: 1,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        },
                      }}
                    >
                      {t('register')}
                    </Button>
                  </Link>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>{' '}
    </>
  );
}

export default ResponsiveAppBar;