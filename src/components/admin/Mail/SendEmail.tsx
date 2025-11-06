'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import './EmailSender.css';

const WEBSITE_LINK = process.env.NEXT_PUBLIC_API_URL;

import type { Editor } from '@ckeditor/ckeditor5-core';
import type { EditorWatchdog, ContextWatchdog } from '@ckeditor/ckeditor5-watchdog';

// Interface for CKEditor compatibility
interface CKEditorCompatible {
  create: (...args: unknown[]) => Promise<Editor>;
  EditorWatchdog: typeof EditorWatchdog;
  ContextWatchdog: typeof ContextWatchdog;
}

interface EmailFormData {
  subject: string;
  content: string;
  discountPercentage?: string;
  expiryDate?: dayjs.Dayjs | null;
}

interface FormDataState {
  newsEmail1: EmailFormData;
  newsEmail2: EmailFormData;
  sendEmail: EmailFormData;
  couponEmail: EmailFormData & {
    discountPercentage: string;
    expiryDate: dayjs.Dayjs | null;
  };
}

interface FieldErrors {
  subject?: string;
  content?: string;
  discountPercentage?: string;
  expiryDate?: string;
}

interface EmailSenderProps {
  sendEmail?: boolean;
  leadsIds?: string[];
  handleSubmitEmail: (data: { subject: string; content: string; leadsIds?: string[] }) => void;
}

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zoxxo Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #f8f8f8;
            color: black;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            background-color: #ff0000;
            color: white !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #cc0000;
        }
        .footer {
            background-color: #f8f8f8;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${WEBSITE_LINK}/uploads/logo.png" alt="NextDeal" style="width: 80px; height: 70px;">
            <h2>NextDeal</h2>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>Â© NextDeal.com | TM and Â© ${new Date().getFullYear()} zoxxo Inc.</p>
            <p>
                <a href="${WEBSITE_LINK}/terms-of-service" >Terms of Service</a> |
                <a href="${WEBSITE_LINK}/privacy-policy" >Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

const EmailSender: React.FC<EmailSenderProps> = ({
  sendEmail = true,
  leadsIds,
  handleSubmitEmail,
}) => {
  const theme = useTheme();
  const [openModals, setOpenModals] = useState({
    newsEmail1: false,
    newsEmail2: false,
    couponEmail: false,
  });
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormDataState>({
    newsEmail1: { subject: '', content: '' },
    newsEmail2: { subject: '', content: '' },
    sendEmail: { subject: '', content: '' },
    couponEmail: {
      subject: '',
      content: '',
      discountPercentage: '',
      expiryDate: null,
    },
  });

  // CKEditor configuration
  const editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      // 'link',
      'bulletedList',
      'numberedList',
      '|',
      // 'outdent',
      // 'indent',
      '|',
      // 'blockQuote',
      // 'insertTable',
      'undo',
      'redo',
    ],
    placeholder: 'Type your email content here...',
  };

  // Add a function to reset form data
  const resetFormData = (type: string) => {
    const emptyForm = {
      subject: '',
      content: '',
      discountPercentage: '',
      expiryDate: null,
    };

    setFormData((prevData) => ({
      ...prevData,
      [type]: emptyForm,
    }));

    // Reset field errors
    setFieldErrors({});

    // Reset active tab to editor
    setActiveTab('editor');
  };

  // Your existing functions remain the same until renderEmailModal
  const handleOpen = (modalType: string) => setOpenModals({ ...openModals, [modalType]: true });

  const handleChange = (modalType: string, field: string, value: string | number | dayjs.Dayjs | null) => {
    setFormData({
      ...formData,
      [modalType as keyof typeof formData]: { ...formData[modalType as keyof typeof formData], [field]: value },
    });
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined });
    }
  };

  // Add handleEditorChange function specifically for CKEditor
  const handleEditorChange = (modalType: string, _event: unknown, editor: { getData: () => string }) => {
    const data = editor.getData();
    handleChange(modalType, 'content', data);
  };
  const handleClose = (modalType: string) => {
    setOpenModals({ ...openModals, [modalType]: false });
    resetFormData(modalType);
  };

  const validateFields = (type: string) => {
    const data = formData[type as keyof typeof formData];
    const errors: FieldErrors = {};

    if (type === 'couponEmail') {
      if (!data.discountPercentage) {
        errors.discountPercentage = 'Discount percentage is required' ;
      } else if (Number(data.discountPercentage) < 0 || Number(data.discountPercentage) > 100) {
        errors.discountPercentage = 'Discount must be between 0 and 100';
      }

      if (!data.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (dayjs.isDayjs(data.expiryDate) && data.expiryDate.isBefore(dayjs(), 'day')) {
        errors.expiryDate = 'Expiry date cannot be in the past';
      }
    }
    // Check for empty or whitespace-only subject
    if (!data.subject?.trim()) {
      errors.subject = 'Subject is required';
    }

    // Check for empty or whitespace-only content
    if (!data.content?.trim()) {
      errors.content = 'Content is required';
    }

    // Validate coupon-specific fields
    if (type === 'couponEmail') {
      if (!data.discountPercentage) {
        errors.discountPercentage = 'Discount percentage is required';
      } else if (Number(data.discountPercentage) < 0 || Number(data.discountPercentage) > 100) {
        errors.discountPercentage = 'Discount must be between 0 and 100';
      }

      if (!data.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (dayjs.isDayjs(data.expiryDate) && data.expiryDate.isBefore(dayjs(), 'day')) {
        errors.expiryDate = 'Expiry date cannot be in the past';
      }
    }

    return errors;
  };

  const handleSend = async (type: string) => {
    const errors = validateFields(type);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Show error message for content if it's empty
      if (errors.content) {
        toast.error(errors.content);
      }
      return;
    }

    try {
      handleSubmitEmail({
        subject: formData[type as keyof typeof formData].subject,
        content: formData[type as keyof typeof formData].content,
        leadsIds,
      });
      resetFormData(type);

      // Close the modal
      handleClose(type);
    } catch {
      toast.error('Failed to send email. Please try again.');
    }
  };

  const renderPreview = (type: string) => {
    const previewContent = formData[type as keyof typeof formData].content;

    return (
      <Box
        sx={{
          p: 2,
          border: '1px solid #ccc',
          borderRadius: 1,
          bgcolor: 'white',
        }}
      >
        <iframe
          srcDoc={baseTemplate(previewContent)}
          style={{ width: '100%', height: '600px', border: 'none' }}
          title="Email Preview"
          sandbox="allow-same-origin"
        />
      </Box>
    );
  };

  const renderEmailModal = (type: string, title: string) => (
    <Dialog open={openModals[type as keyof typeof openModals]} onClose={() => handleClose(type)} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Email Subject"
            fullWidth
            value={formData[type as keyof typeof formData].subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(type, 'subject', e.target.value)}
            error={!!fieldErrors.subject}
            helperText={fieldErrors.subject}
          />

          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Editor" value="editor" />
            <Tab label="Preview" value="preview" />
          </Tabs>

          {activeTab === 'editor' ? (
            <Box
              sx={{
                border: '1px solid',
                borderColor:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(255, 255, 255, 0.12)'
                                      : 'rgba(0, 0, 0, 0.12)',
                borderRadius: 1,
                mt: 2,
                // Add background color to the editor container
                bgcolor:
                                    theme.palette.mode === 'dark'
                                      ? 'background.paper'
                                      : 'background.default',
              }}
            >
              <CKEditor
                editor={ClassicEditor as unknown as CKEditorCompatible}
                config={editorConfig}
                data={formData[type as keyof typeof formData].content}
                onChange={(_event, editor) =>
                  handleEditorChange(type, _event, editor)
                }
              />
            </Box>
          ) : (
            renderPreview(type)
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ mx: 2, m: 2 }}>
        <Button onClick={() => handleClose(type)}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => handleSend(type)}>
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Stack direction="row" spacing={2}>
      {sendEmail && (
        <Button
          sx={{ maxHeight: 40 }}
          variant="contained"
          onClick={() => handleOpen('sendEmail')}
        >
                    Send Email
        </Button>
      )}

      {renderEmailModal('sendEmail', 'Send Cause')}
    </Stack>
  );
};

export default EmailSender;

