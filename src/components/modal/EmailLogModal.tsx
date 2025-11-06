'use client';
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { HiOutlineMailOpen } from 'react-icons/hi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'sent':
    case 'success':
      return 'green';
    case 'failed':
    case 'error':
      return 'red';
    default:
      return '#555';
  }
};

interface EmailLog {
  sentAt: string;
  subject: string;
  status: string;
  response: string;
  content: string;
}

const EmailLogModal = ({ open, handleClose, emailLogs = [] }: { open: boolean, handleClose: () => void, emailLogs: EmailLog[] }) => {
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const handleViewContent = (log: EmailLog) => {
    setSelectedLog(log);
  };

  const handleCloseDialog = () => {
    setSelectedLog(null);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <HiOutlineMailOpen size={24} />
              <Typography variant="h6" fontWeight={600}>
                                Email Send Logs
              </Typography>
            </Box>
            <Tooltip title="Close">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {emailLogs?.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" mt={4}>
                            No email logs available.
            </Typography>
          ) : (
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Response</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailLogs.map((log, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      {new Date(log.sentAt)?.toLocaleString()}
                    </TableCell>
                    <TableCell>{log?.subject}</TableCell>
                    <TableCell
                      sx={{
                        color: getStatusColor(log?.status),
                        fontWeight: 500,
                      }}
                    >
                      {log?.status}
                    </TableCell>
                    <TableCell>{log?.response}</TableCell>
                    <TableCell>
                      <Tooltip title="View Content">
                        <IconButton onClick={() => handleViewContent(log)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>

      {/* Dialog to show full email content */}
      <Dialog open={!!selectedLog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Email Content</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subject:
          </Typography>
          <Typography mb={2}>{selectedLog?.subject}</Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Content:
          </Typography>
          <Typography whiteSpace="pre-line">{selectedLog?.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
                        Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmailLogModal;

