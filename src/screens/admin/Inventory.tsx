'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Stack,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  Pagination,
  Collapse,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import colors from '@/components/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicaleApi } from '@/lib/api/vehicale';
import UpdateCarModal from '@/components/modal/UpdateCarModal';
import { toast } from 'react-toastify';
import CreateCarGarageModal from '@/components/modal/CreateCarGarageModal';
import PropTypes from 'prop-types';
import { deleteGarage } from '@/lib/api/garage';
import SparePartModalForm from '@/components/modal/SparePartModalForm';
import { deleteSparePart } from '@/lib/api/sparePart';
import EditSparePartModal from '@/components/modal/EditSparePartModal';
import EditCarGarageModal from '@/components/modal/EditCarGarageModal';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';
import useAuth from '@/lib/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import ListingStatus from '@/components/ui/ListingStatus';
import { safeLocalStorage } from '@/lib/utils/secureStorage';
import { Vehicle, Garage, User } from '@/types';
import Price from '@/components/ui/Price';
import StatusChangeModal from '@/components/modal/StatusChangeModal';
import SoldModal, { SoldData } from '@/components/modal/SoldModal';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface CarData {
  _id: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  description?: string;
  features?: string[];
  media?: Array<{ url: string }>;
  [key: string]: unknown;
}

interface SparePartData {
  _id?: string;
  name?: string;
  partNumber?: string;
  description?: string;
  compatibleCars?: string[];
  price?: number | string;
  quantityInStock?: number;
  condition?: string;
  images?: string[];
  category?: string;
  isAvailable?: boolean;
}

interface CustomTabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
  [key: string]: unknown;
}

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

const InventoryComponent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const route = useRouter();
  const { primary, white } = colors;

  const [openGarage, setOpeGarage] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [setUpdateCar, setSetUpdateCar] = useState<Vehicle | null>(null);
  const [openSparePartEditModal, setSpenSparePartEditModal] = useState(false);
  const [sparePartEditModalData] = useState<SparePartData>({});
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: string } | null>(null);
  const [deleteCount, setDeleteCount] = useState(() => {
    const saved = safeLocalStorage.getDeleteCount();
    return saved ? parseInt(saved, 10) : 0;
  });

  const [openEditGarageModal, setOpeEditGarageModal] = useState(false);
  const [editGarageData] = useState<Garage[]>([]);
  const [openSparePartModal, setOpenSparePartModal] = useState(false);
  const [openStatusChangeModal, setOpenStatusChangeModal] = useState(false);
  const [openSoldModal, setOpenSoldModal] = useState(false);
  const [selectedVehicleForStatus, setSelectedVehicleForStatus] = useState<Vehicle | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['get-vehicale'],
    queryFn: () => vehicaleApi.getAllVehicale(user as User),
  });

  // useQuery({
  //   queryKey: ['get-garageData'],
  //   queryFn: () => getGarage(page, 10),
  // });
  // useQuery({
  //   queryKey: ['get-sparePartsData'],
  //   queryFn: () => {
  //     if (!user) throw new Error('User not authenticated');
  //     return getSparePart(page, 10, user);
  //   },
  // });

  // const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
  //     setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //     setAnchorEl(null);
  // };
  // const handleFilterSelect = (value) => {
  //     setSelectedFilter(value);
  //     setAnchorEl(null);
  // };

  const { mutate: DeleteGarage } = useMutation({
    mutationFn: (id: string) => deleteGarage(id),
    onSuccess: () => {
      toast.success('Garage deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-garageData'] });
    },
    onError: () => {
      toast.error('Failed to delete Garage. Please try again.');
    },
  });
  const { mutate: deleteSpareParts } = useMutation({
    mutationFn: (id: string) => {
      if (!user) throw new Error('User not authenticated');
      return deleteSparePart(id, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-sparePartsData'] });
      setOpenModal(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast.error('Failed to delete SpareParts. Please try again.');
    },
  });

  useEffect(() => {
    safeLocalStorage.setDeleteCount(deleteCount.toString());
  }, [deleteCount]);

  const { mutate: onConfirm } = useMutation({
    mutationFn: (id: string) => vehicaleApi.deleteVehicale(id, user as User),
    onSuccess: () => {
      toast.success('Car deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-vehicale'] });
      setDeleteCount((prev) => prev + 1);
    },
    onError: () => {
      toast.error('Failed to delete car. Please try again.');
    },
  });
  const handleDeleteClick = (carId: string) => {
    setSelectedItem({ id: carId, type: 'car' });

    setOpenModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;

    const { id, type } = selectedItem;

    switch (type) {
      case 'car':
        onConfirm(id);
        break;
      case 'garage':
        DeleteGarage(id);
        break;
      case 'sparePart':
        deleteSpareParts(id);
        break;
      default:
        toast.error(`Unknown delete type: ${type}`);
    }

    setOpenModal(false);
  };

  const { mutate: onUpdateCar } = useMutation({
    mutationFn: (params: { id: string; data: FormData; user: User }) => vehicaleApi.updateVehicale(params),
    onSuccess: () => {
      toast.success('Car updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-vehicale'] });
      setOpenUpdateModal(false);
    },
    onError: (error: unknown) => {
      const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update car. Please try again.';
      toast.error(message);
    },
  });
  const handleUpdate = (carId: string, updatedData: FormData) => {
    setOpenUpdateModal(true);
    onUpdateCar({ id: carId, data: updatedData, user: user as User });
  };

  const handleOpenUpdateModal = (car: Vehicle) => {
    setOpenUpdateModal(true);
    setSetUpdateCar(car);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenUpdateModal(false);
  };

  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      vehicaleApi.updateVehicleStatus({ id, status, user: user as User }),
    onSuccess: () => {
      toast.success('Status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-vehicale'] });
      setSelectedVehicleForStatus(null);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update status. Please try again.';
      toast.error(message);
    },
  });

  const { mutate: markAsSoldMutation, isPending: isMarkingSold } = useMutation({
    mutationFn: ({ id, soldData }: { id: string; soldData: SoldData }) =>
      vehicaleApi.markVehicleAsSold({ id, soldData: soldData as unknown as Record<string, unknown>, user: user as User }),
    onSuccess: () => {
      toast.success('Vehicle marked as sold successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-vehicale'] });
      setOpenSoldModal(false);
      setSelectedVehicleForStatus(null);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to mark vehicle as sold. Please try again.';
      toast.error(message);
    },
  });

  const handleStatusChangeClick = (item: Vehicle) => {
    setSelectedVehicleForStatus(item);
    setOpenStatusChangeModal(true);
    handleMenuClose();
  };

  const handleStatusSelect = (status: string) => {
    if (!selectedVehicleForStatus) return;

    if (status === 'Sold') {
      // Close status modal and open sold modal, keeping vehicle selected
      setOpenStatusChangeModal(false);
      // Small delay to ensure modal state updates properly
      setTimeout(() => {
        setOpenSoldModal(true);
      }, 100);
    } else {
      // For non-Sold statuses, update and clear selection
      updateStatusMutation({
        id: selectedVehicleForStatus._id,
        status,
      });
      setOpenStatusChangeModal(false);
      setSelectedVehicleForStatus(null);
    }
  };

  const handleSoldConfirm = (soldData: SoldData, vehicleId?: string) => {
    console.log('handleSoldConfirm called', { soldData, selectedVehicleForStatus, vehicleId });
    
    // Get vehicle ID from selectedVehicleForStatus or from parameter
    const id = selectedVehicleForStatus?._id || vehicleId;
    
    if (!id) {
      toast.error('Vehicle not selected');
      return;
    }
    
    console.log('Calling markAsSoldMutation with vehicle ID:', id);
    markAsSoldMutation({
      id,
      soldData,
    });
  };

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!data || !user) return;

    if (user?.role?.roleId === 'dealer') {
      const filtered = data?.data?.filter((item: Vehicle) => item?.postedBy === user?._id);
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(data?.data);
    }
  }, [data, user]);

  const today = useMemo(() => new Date(), []);

  // . Main Tabs
  const [mainTab, setMainTab] = useState<number>(0);
  //  Sub Tabs
  const [subTab, setSubTab] = useState<number>(0);

  // Filtering logic

  const subTabsForMainTab = useMemo(() => {
    if (mainTab === 2) {
      return [t('subTabs.active'), t('subTabs.expired')];
    }
    return [
      t('subTabs.all'),
      t('subTabs.withActiveExclusivity'),
      t('subTabs.sold'),
      t('subTabs.new'),
      t('subTabs.nearEndOfExclusivity'),
      t('subTabs.exclusivityEnded'),
    ];
  }, [mainTab, t]);

  //  Apply Search

  const filteredDatas = useMemo(() => {
    const items = filteredVehicles;

    const currentTab = subTabsForMainTab[subTab];

    if (currentTab === t('subTabs.all') || currentTab === t('subTabs.active')) {
      return items;
    }

    if (
      currentTab === t('subTabs.withActiveExclusivity') ||
            currentTab === t('subTabs.active')
    ) {
      return items?.filter((item: Vehicle) => item?.status === 'Available');
    }

    if (currentTab === t('subTabs.sold')) {
      return items?.filter((item: Vehicle) => item?.status === 'Sold');
    }

    if (currentTab === t('subTabs.new')) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      return items?.filter((item: Vehicle) => {
        const createdAt = new Date(item.createdAt || '');
        return createdAt >= sevenDaysAgo && createdAt <= today;
      });
    }

    if (currentTab === t('subTabs.nearEndOfExclusivity')) {
      const lowerBound = new Date();
      lowerBound.setDate(today.getDate() - 29);
      const upperBound = new Date();
      upperBound.setDate(today.getDate() - 26);
      return items?.filter((item: Vehicle) => {
        const createdAt = new Date(item.createdAt || '');
        return createdAt >= lowerBound && createdAt <= upperBound;
      });
    }

    if (currentTab === t('subTabs.exclusivityEnded') || currentTab === t('subTabs.expired')) {
      const expiry = new Date();
      expiry.setDate(today.getDate() - 30);
      return items?.filter((item: Vehicle) => {
        const createdAt = new Date(item.createdAt || '');
        return createdAt <= expiry;
      });
    }

    return items;
  }, [filteredVehicles, subTab, subTabsForMainTab, t, today]);

  const subTabCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    subTabsForMainTab.forEach((label) => {
      if (label === t('subTabs.withActiveExclusivity')) {
        counts[label] = filteredVehicles?.filter(
          (item: Vehicle) => item.status === 'Available',
        )?.length || 0;
      } else if (label === t('subTabs.sold')) {
        counts[label] = filteredVehicles?.filter((item: Vehicle) => item.status === 'Sold')?.length || 0;
      } else if (label === t('subTabs.new')) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        counts[label] = filteredVehicles?.filter((item: Vehicle) => {
          const createdAt = new Date(item.createdAt || '');
          return createdAt >= sevenDaysAgo && createdAt <= today;
        })?.length || 0;
      } else if (label === t('subTabs.nearEndOfExclusivity')) {
        const lowerBound = new Date();
        lowerBound.setDate(today.getDate() - 29);
        const upperBound = new Date();
        upperBound.setDate(today.getDate() - 26);
        counts[label] = filteredVehicles?.filter((item: Vehicle) => {
          const createdAt = new Date(item.createdAt || '');
          return createdAt >= lowerBound && createdAt <= upperBound;
        })?.length || 0;
      } else if (label === t('subTabs.exclusivityEnded') || label === t('subTabs.expired')) {
        const expiry = new Date();
        expiry.setDate(today.getDate() - 30);
        counts[label] = filteredVehicles?.filter((item: Vehicle) => {
          const createdAt = new Date(item.createdAt || '');
          return createdAt <= expiry;
        })?.length || 0;
      } else {
        counts[label] = filteredVehicles?.length || 0;
      }
    });

    return counts;
  }, [filteredVehicles, subTabsForMainTab, t, today]);

  const [anchorEl1, setAnchorEl1] = useState<HTMLElement | null>(null);
  const [selectedItems, setSelectedItems] = useState<Vehicle | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: Vehicle) => {
    setAnchorEl1(event.currentTarget);
    setSelectedItems(item);
  };

  const handleMenuClose = () => {
    setAnchorEl1(null);
    setSelectedItems(null);
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const buttonStyle = {
    background: primary,
    color: white,
    mx: 1,
    my: 2,
    px: isSmall ? 2 : 3,
    py: isSmall ? 0.8 : 1,
    fontSize: isSmall ? '14px' : '16px',
    textTransform: 'none',
  };

  return (
    <Box sx={{ m: { xs: 0, md: 2 } }}>
      <Box sx={{}}>
        <Button
          variant="outlined"
          sx={{ ...buttonStyle, my: 2 }}
          onClick={() => route.push('/admin/add-vehicle')}
        >
          {t('add')}
        </Button>

      </Box>

      {/* ListingStatus Component */}
      <ListingStatus
        data={
          filteredVehicles?.map((vehicle) => ({
            ...vehicle,
            createdAt: vehicle.createdAt ?? '',
          })) ?? []
        }
        deleteCount={deleteCount}
      />

      <Box
        sx={{
          background: '#f9fafb',
          borderRadius: 4,
          mt: 1,
          mb: 1,
          boxShadow: '0 2px 8px rgba(43, 42, 42, 0.05)',
          border: '1px solid #d6d6d6',
        }}
      >
        {/*  MAIN Tabs */}
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={mainTab}
          onChange={(e, newVal) => {
            setMainTab(newVal);
            setSubTab(0);
          }}
          sx={{
            mb: 1,
            p: 1,
            border: '1px solid #d6d6d6',
            background: '#f6f6f6',
            borderTopRightRadius: 11,
            borderTopLeftRadius: 11,
          }}
        >
          <Tab label={t('myListings')} />
          <Tab label={t('saved')} />
          <Tab label={t('inMiniSite')} />
        </Tabs>
        <div className="padding">
          {/*  SUB Tabs */}

          <Tabs
            value={subTab}
            onChange={(e, newVal) => setSubTab(newVal)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {subTabsForMainTab.map((label, idx) => (
              <Tab
                key={idx}
                style={{ marginRight: '20px' }}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={subTabCounts[label] ?? 0}
                      size="small"
                      color={
                        label === t('subTabs.sold')
                          ? 'success'
                          : label === t('subTabs.withActiveExclusivity')
                            ? 'primary'
                            : label === t('subTabs.exclusivityEnded')
                              ? 'error'
                              : label === t('subTabs.active')
                                ? 'success'
                                : label === t('subTabs.expired')
                                  ? 'error'
                                  : 'default'
                      }
                      sx={{ borderRadius: '8px' }}
                    />
                    <Typography variant="body2">{label}</Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/*  Listings Count */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('myListings')} ({filteredVehicles?.length})
          </Typography>

          {/*  Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead style={{ background: '#f3e5b6' }}>
                <TableRow>
                <TableCell>Actions</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Image</TableCell>

                  <TableCell>{t('price')}</TableCell>
                  <TableCell>{t('status')}</TableCell>

                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredDatas
                  ?.slice((page - 1) * limit, page * limit)
                  .map((item: Vehicle) => {
                    const isExpanded = expandedRowId === item._id;
                    return (
                      <React.Fragment key={item._id}>
                        <TableRow>
                          <TableCell
                            style={{
                              display: 'flex',
                              gap: 2,
                              border: 0,
                            }}
                          >

                            <Link href={`/cars/${item._id}`} passHref>
                              <IconButton color="primary">
                                <OpenInNewIcon />
                              </IconButton>
                            </Link>

                            <IconButton
                              onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, item)}
                            >
                              <MoreVertIcon />
                            </IconButton>

                            {/* menus */}
                            <Menu
                              anchorEl={anchorEl1}
                              open={
                                Boolean(anchorEl1) &&
                                                                selectedItems?._id === item._id
                              }
                              onClose={handleMenuClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleOpenUpdateModal(item)
                                }
                              >
                                <ListItemIcon>
                                  <EditIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  {t('edit')}
                                </ListItemText>
                              </MenuItem>

                              <MenuItem
                                onClick={() =>
                                  handleStatusChangeClick(item)
                                }
                              >
                                <ListItemIcon>
                                  <SwapHorizIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  {t('changeStatus') || 'Change Status'}
                                </ListItemText>
                              </MenuItem>

                              <MenuItem
                                onClick={() =>
                                  handleDeleteClick(item?._id)
                                }
                              >
                                <ListItemIcon>
                                  <DeleteIcon color="error" />
                                </ListItemIcon>
                                <ListItemText
                                  sx={{ color: 'error.main' }}
                                >
                                  {t('delete')}
                                </ListItemText>
                              </MenuItem>
                            </Menu>

                            <IconButton
                              size="small"
                              onClick={() => {
                                setExpandedRowId(
                                  isExpanded ? null : item._id,
                                );
                              }}
                            >
                              {isExpanded ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <IoIosArrowForward />
                              )}
                            </IconButton>
                          </TableCell>

                          <TableCell>{item?.title}</TableCell>
                          <TableCell>{item?.brand}</TableCell>
                          <TableCell>{item?.model}</TableCell>

                          <TableCell>
                            <img
                              src={
                                item?.media?.[0]?.url ||
                                                                'https://via.placeholder.com/50'
                              }
                              alt="property"
                              width={80}
                              height={60}
                              style={{ borderRadius: 4 }}
                            />
                          </TableCell>

                          <TableCell><Price amountUSD={Number(item.price) || 0} /></TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={t(item.status.toLowerCase())}
                                color={
                                  item.status === 'Sold'
                                    ? 'success'
                                    : 'warning'
                                }
                                size="small"
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Expandable Content Row */}
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            sx={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse
                              in={isExpanded}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box
                                sx={{
                                  borderRadius: 2,
                                  p: 2,
                                  backgroundColor: '#fff',
                                  boxShadow: 2,
                                  minWidth: '100%',
                                  width: '100%',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: {
                                      xs: 'column',
                                      sm: 'row',
                                    }, // Column on small, row on medium+

                                    gap: 2,
                                  }}
                                >
                                  {/* Title and Price */}
                                  <Stack
                                    sx={{
                                      width: {
                                        xs: '100%',
                                        md: '50%',
                                      },
                                    }}
                                    justifyContent="flex-start"
                                    alignItems={{
                                      xs: 'flex-start',
                                    }}
                                    spacing={1}
                                  >
                                    <Typography
                                      variant="h5"
                                      fontWeight={600}
                                    >
                                      {item?.title} -{' '}
                                      {item?.brand}{' '}
                                      {item?.model}
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      color="green"
                                    >
                                      <Price amountUSD={Number(item?.price) || 0} />
                                    </Typography>
                                  </Stack>

                                  {/* Image */}
                                  <Box
                                    sx={{
                                      width: {
                                        xs: '55%',
                                        md: '50%',
                                      },
                                      height: {
                                        xs: 200,
                                        md: 300,
                                      },
                                      backgroundImage: `url(${item?.media?.[0]?.url || ''})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition:
                                                                                'center',
                                      borderRadius: 2,
                                    }}
                                  />
                                </Box>

                                {/* Details */}
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('year')}
                                    </Typography>
                                    <Typography>
                                      {item?.year}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('vinNumber')}
                                    </Typography>
                                    <Typography>
                                      {item?.vinNumber || '-'}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('mileage')}
                                    </Typography>
                                    <Typography>
                                      {item?.mileage} km
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('transmission')}
                                    </Typography>
                                    <Typography>
                                      {item?.transmission}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('fuelType')}
                                    </Typography>
                                    <Typography>
                                      {item?.fuelType}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('condition')}
                                    </Typography>
                                    <Typography>
                                      {item?.condition}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      {t('location')}
                                    </Typography>
                                    <Typography>
                                      {item?.location?.city},{' '}
                                      {item?.location?.state},{' '}
                                      {
                                        item?.location
                                          ?.country
                                      }
                                    </Typography>
                                  </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                {/* Features */}
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {t('features')}
                                </Typography>
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  spacing={2}
                                  mt={1}
                                  gap={1}
                                >
                                  {item?.features?.map(
                                    (feature: string, index: number) => (
                                      <Chip
                                        key={index}
                                        label={feature}
                                        variant="outlined"
                                      />
                                    ),
                                  )}
                                </Stack>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination Controls */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={{ xs: 2 }}
            mt={3}
            px={{ xs: 0, md: 2 }}
            py={2}
          >
            <TextField
              select
              label="Rows per page"
              value={limit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              size="small"
              sx={{ width: 140 }}
            >
              {[5, 10, 20, 50].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Pagination
              count={Math.ceil((filteredDatas?.length || 0) / limit)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Stack>
        </div>
      </Box>

      <CreateCarGarageModal open={openGarage} onClose={() => setOpeGarage(false)} />

      <DeleteConfirmationModal
        open={openModal}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        itemName="spare part"
      />
      <UpdateCarModal
        open={openUpdateModal}
        handleClose={handleModalClose}
        handleUpdate={handleUpdate}
        carData={setUpdateCar as unknown as CarData}
      />
      <SparePartModalForm
        open={openSparePartModal}
        onClose={() => setOpenSparePartModal(false)}
      />
      <EditSparePartModal
        open={openSparePartEditModal}
        onClose={() => setSpenSparePartEditModal(false)}
        initialData={sparePartEditModalData}
      />
      {openEditGarageModal && (
        <EditCarGarageModal
          open={openEditGarageModal}
          onClose={() => setOpeEditGarageModal(false)}
          initialData={editGarageData as unknown as Garage}
        />
      )}

      <StatusChangeModal
        open={openStatusChangeModal}
        onClose={() => {
          setOpenStatusChangeModal(false);
          // Only clear vehicle selection if sold modal is not opening
          if (!openSoldModal) {
            setSelectedVehicleForStatus(null);
          }
        }}
        onStatusSelect={handleStatusSelect}
      />

      <SoldModal
        open={openSoldModal}
        onClose={() => {
          if (!isMarkingSold) {
            setOpenSoldModal(false);
            setSelectedVehicleForStatus(null);
          }
        }}
        onConfirm={(data, vehicleId) => handleSoldConfirm(data, vehicleId)}
        vehicleId={selectedVehicleForStatus?._id || ''}
        sellerId={user?._id || ''}
        isLoading={isMarkingSold}
      />
    </Box>
  );
};
export default InventoryComponent;

