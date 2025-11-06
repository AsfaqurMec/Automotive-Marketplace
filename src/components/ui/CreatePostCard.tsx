'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { FiSmile, FiVideo, FiImage } from 'react-icons/fi';
import CloseIcon from '@mui/icons-material/Close';
import { createCommunityPost } from '@/lib/api/community';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import colors from '../styles';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

const CreatePostCard: React.FC = () => {
  const [privacy, setPrivacy] = useState<string>('Public');
  const [region, setRegion] = useState<string>('Global');
  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const { t } = useTranslation();
  const { foreground, background } = colors;
  const queryClient = useQueryClient();
  const language = i18n.language || 'en';
  const isRtl = language === 'he' || (typeof document !== 'undefined' && document.dir === 'rtl');

  const handleMediaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const type = e.target.accept.includes('image') ? 'image' : 'video';

    if (type === 'image') {
      setImages((prev: File[]) => [...prev, ...files]);
    } else if (type === 'video' && files.length > 0) {
      setVideo(files[0] as File);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      toast.success('Post submitted!');
      setText('');
      setImages([]);
      setVideo(null);

      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: () => {
      toast.error('Failed to post. Please try again.');
    },
  });

  const handlePost = () => {
    if (!privacy || !region || region === 'Region') {
      toast.warn('Please select both privacy and region.');
      return;
    }

    const hasText = text.trim().length > 0;
    const hasImages = images.length > 0;
    const hasVideo = video !== null;

    if (!hasText && !hasImages && !hasVideo) {
      toast.warn('Please add text or media (image/video) before posting.');
      return;
    }

    const formData = new FormData();
    formData.append('privacy', privacy);
    formData.append('region', region);
    formData.append('text', text);

    images.forEach((img) => {
      formData.append('media', img);
    });

    if (video) {
      formData.append('media', video);
    }

    mutate(formData);
  };

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 3 },
        maxWidth: 1400,
        background: background,
        minHeight: '100%',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          p: { xs: 1, sm: 2 },
          background: background,
          boxShadow: 'none',
          border: 0,
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontFamily: 'Rubik',
              fontWeight: 500,
              fontSize: { xs: '22px', sm: '28px', md: '36px' },
              lineHeight: 1.2,
              textAlign: isRtl ? 'left' : 'right',
              mb: 2,
            }}
          >
            {t('createPost')}
          </Typography>

          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} mb={2}>
            <FormControl size="small">
              <Select value={privacy} onChange={(e: SelectChangeEvent<string>) => setPrivacy(e.target.value)}>
                <MenuItem value="Privacy" disabled>
                                    Privacy
                </MenuItem>
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem selected value="Public">
                                    Public
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select value={region} onChange={(e: SelectChangeEvent<string>) => setRegion(e.target.value)}>
                <MenuItem value="Region" disabled>
                                    Region
                </MenuItem>
                <MenuItem selected value="Global">
                                    Global
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              p: 2,
              mb: 2,
              minHeight: 200,
              background: foreground,
            }}
          >
            <TextField
              variant="standard"
              placeholder={t('whatsOnYourMind')}
              fullWidth
              multiline
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
            <IconButton>
              <FiSmile />
            </IconButton>
          </Box>

          {(images.length > 0 || video) && (
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              {images.map((img, idx) => (
                <Box key={idx} position="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(idx)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: '#fff',
                      border: '1px solid #ccc',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {video && (
                <Box position="relative">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    style={{ width: 160, borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={removeVideo}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: '#fff',
                      border: '1px solid #ccc',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
            mt={5}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: '#bfa76f',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={handlePost}
              disabled={isPending}
            >
                            Post
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<FiVideo style={{ marginLeft: isRtl ? 9 : 0 }} />}
                sx={{ textTransform: 'none' }}
                onClick={() => (document.getElementById('video-upload') as HTMLInputElement)?.click()}
              >
                                Video
              </Button>

              <Button
                startIcon={<FiImage style={{ marginLeft: isRtl ? 9 : 0 }} />}
                sx={{ textTransform: 'none' }}
                onClick={() => (document.getElementById('image-upload') as HTMLInputElement)?.click()}
              >
                                Images
              </Button>

              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                hidden
                onChange={handleMediaInput}
              />
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                hidden
                onChange={handleMediaInput}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePostCard;

