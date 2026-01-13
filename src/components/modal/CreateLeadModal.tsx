'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  FormLabel,
  Autocomplete,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import useAuth from '@/lib/hooks/useAuth';

const leadStatuses = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
  'Converted',
  'In Progress',
  'Closed',
];

interface LeadFormValues {
  fullName: string;
  email: string;
  phone: string;
  source: string;
  interestedIn: string;
  status: string;
  budget?: string;
  assignedTo?: string;
  createdBy?: string;
}

interface DealerData {
  _id: string;
  fullName: string;
  [key: string]: unknown;
}

type DealerArray = DealerData[];

const CreateLeadModal = ({ open, onClose, onSubmit, dealer }: { open: boolean, onClose: () => void, onSubmit: (values: LeadFormValues) => void, dealer: DealerArray }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [assignToAll, setAssignToAll] = useState(false);

  useEffect(() => {
    if (!open) {
      setAssignToAll(false);
    }
  }, [open]);
  const initialValues: LeadFormValues = {
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    source: '',
    interestedIn: '',
    status: 'New',
    assignedTo: undefined,
    budget: '',
    createdBy: user?._id || '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    source: Yup.string(),
    interestedIn: Yup.string(),
    budget: Yup.string(),
    status: Yup.string().required('Status is required'),
    assignedTo: Yup.string().optional(),
    createdBy: Yup.string().optional(),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('createNewLead')}</DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            const { assignedTo, ...rest } = values;
            const finalData = assignedTo ? { ...rest, assignedTo } : { ...rest };
            onSubmit(finalData as LeadFormValues);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <Form>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('fullName')}</FormLabel>
                    <TextField
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fullName && Boolean(errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('email')}</FormLabel>
                    <TextField
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('phone')}</FormLabel>
                    <TextField
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('source')}</FormLabel>
                    <TextField
                      name="source"
                      value={values.source}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.source && Boolean(errors.source)}
                      helperText={touched.source && errors.source}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('interestedIn')}</FormLabel>
                    <TextField
                      name="interestedIn"
                      value={values.interestedIn}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.interestedIn && Boolean(errors.interestedIn)
                      }
                      helperText={touched.interestedIn && errors.interestedIn}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('budget')}</FormLabel>
                    <TextField
                      name="budget"
                      value={values.budget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.budget && Boolean(errors.budget)}
                      helperText={touched.budget && errors.budget}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{t('status')}</FormLabel>
                    <TextField
                      select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                    >
                      {leadStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={assignToAll}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setAssignToAll(isChecked);
                            if (isChecked) {
                              setFieldValue('assignedTo', undefined);
                            }
                          }}
                        />
                      }
                      label={t('Assign to All') || 'Assign to All'}
                    />
                  </FormControl>
                </Grid>

                {!assignToAll && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel>{t('assignDealer')}</FormLabel>
                      <Autocomplete
                        options={dealer}
                        value={values.assignedTo ? dealer.find((d: DealerData) => d._id === values.assignedTo) || null : null}
                        onChange={(_, value) => {
                          const dealerId = value ? value._id : undefined;
                          setFieldValue('assignedTo', dealerId);
                        }}
                        onBlur={handleBlur}
                        getOptionLabel={(option: DealerData) => `${option.fullName || 'N/A'} - ${option.companyName || 'N/A'}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="assignedTo"
                            placeholder="Select a dealer"
                            error={Boolean(touched.assignedTo && errors.assignedTo)}
                            helperText={touched.assignedTo && (errors.assignedTo as string)}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={onClose} color="secondary">
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {t('createLead')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadModal;

