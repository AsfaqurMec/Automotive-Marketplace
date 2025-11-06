import React, { useState } from 'react';
import { Modal, Box, Typography, Button, MenuItem, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReminder } from '@/lib/api/leads';
import { toast } from 'react-toastify';
import useAuth from '@/lib/hooks/useAuth';
import { User, Lead, ApiResponse } from '@/types';

interface ExtendedLead extends Lead {
  reminder?: string;
  task?: string;
  eventId?: string;
}

interface ReminderData {
  reminder: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  task: string;
  leadId: string | undefined;
  googleCalendarEventId?: string;
}

const statusOptions = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
  'Converted',
  'In Progress',
  'Closed',
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UpdateReminderStatusModal: React.FC<{
    open: boolean,
    onClose: () => void,
    lead: ExtendedLead | null,
    setEditLead: (lead: ExtendedLead | null) => void,
}> = ({
  open,
  onClose,
  lead,
  setEditLead,
}) => {
  const [reminder, setReminder] = useState(lead?.reminder || '');
  const [status, setStatus] = useState(lead?.status || 'New');
  const [task, setTask] = useState(lead?.task || '');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (data: ReminderData) => createReminder(data as unknown as Partial<Lead>, user as User),
    onSuccess: (data: ApiResponse<Lead>) => {
      toast.success(data.message || 'Reminder saved successfully!');
      setEditLead(null);
      setReminder('');
      setStatus('');
      setTask('');
      queryClient.resetQueries({ queryKey: ['getLeads'], exact: true });
      queryClient.invalidateQueries({ queryKey: ['getLeads'] });
    },
    onError: () => {
      toast.error('Failed to sync reminder with Google Calendar');
    },
  });
  const handleSave = () => {
    mutate({ reminder, status: status as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost', task, leadId: lead?._id, googleCalendarEventId: lead?.eventId });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
                    Update Reminder, Status & Task
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Reminder Date/Time"
            value={reminder ? dayjs(reminder) : null}
            onChange={(newValue) => setReminder(newValue ? newValue.toISOString() : '')}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setStatus((e.target as HTMLInputElement).value)}
          margin="normal"
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Task"
          value={task}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTask((e.target as HTMLInputElement).value)}
          margin="normal"
          multiline
          rows={4}
        />

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
                        Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
                        Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateReminderStatusModal;

