import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MdDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

interface FileViewerModalProps {
  open: boolean;
  onClose: () => void;
  file: {
    url: string;
    filename: string;
    mimetype: string;
  } | null;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ open, onClose, file }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!file) return;
    
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPdf = file?.mimetype === 'application/pdf' || file?.url?.toLowerCase().endsWith('.pdf');
  const isImage = file?.mimetype?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file?.url || '');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{file?.filename || t('filePreview') || 'File Preview'}</Typography>
          <Box>
            <IconButton onClick={handleDownload} color="primary" sx={{ mr: 1 }}>
              <MdDownload />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
        {file && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            {isPdf ? (
              <iframe
                src={file.url}
                title={file.filename}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            ) : isImage ? (
              <img
                src={file.url}
                alt={file.filename}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('filePreviewNotAvailable') || 'File preview not available'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('fileType') || 'File type'}: {file.mimetype}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<MdDownload />}
                  onClick={handleDownload}
                  sx={{ mt: 2 }}
                >
                  {t('downloadFile') || 'Download File'}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownload} color="primary" variant="outlined" startIcon={<MdDownload />}>
          {t('download') || 'Download'}
        </Button>
        <Button onClick={onClose} color="secondary">
          {t('close') || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerModal;





