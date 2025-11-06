import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  Avatar,
  Box,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FiMessageCircle, FiHeart, FiEye, FiShare2, FiMoreVertical, FiInfo } from 'react-icons/fi';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMutation, useQueryClient, useQueries, useQuery } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import { likePost, createComment } from '@/lib/api/community';
import colors from '../styles';
import moment from 'moment';
import ExpandableText from './ExpandableText';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getUserById } from '@/lib/api/users';
import { getDealerById } from '@/lib/api/dealer';

// TypeScript interfaces for the post data structure
interface DealerInfo {
    _id: string;
    name?: string;
    fullName?: string;
    profileImage?: string;
    avatar?: string;
}

interface CarInfo {
    _id: string;
    slug: string;
    model: string;
    type: string;
    year: number;
    features?: string[];
}

interface LikeInfo {
    _id: string;
    likedByUser: string;
}

interface CommentInfo {
    _id: string;
    text: string;
    commentedAt: string;
    commenterId?: string;
    user?: {
        _id: string;
        name?: string;
        fullName?: string;
        profileImage?: string;
        avatar?: string;
    };
}

interface PostData {
    _id: string;
    text: string;
    media: Array<{ url: string; type?: string }>;
    createdAt: string;
    dealerId: DealerInfo | string; // Can be populated object or just ID string
    views: number;
    likes: LikeInfo[];
    comments: CommentInfo[];
    car?: CarInfo;
}

interface PostCardProps {
    post: PostData;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    text = '',
    media = [],
    createdAt,
    dealerId: initialDealerId,
    views = 0,
    comments: initialComments,
    car,
  } = post;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // Remove local state - rely on server data only
  const likes = post?.likes?.length || 0;
  const liked = post?.likes?.some((like: LikeInfo) => like?.likedByUser === user?._id);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [allCommentsModalOpen, setAllCommentsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState<string>('');
  const [carModalOpen, setCarModalOpen] = useState(false);
  // Remove local comment count state - use server data directly
  const router = useRouter();
  const { t } = useTranslation();

  // Determine if dealerId is just a string (ObjectId) or already populated object
  const dealerIdIsString = typeof initialDealerId === 'string';
  const dealerIdStr = dealerIdIsString ? initialDealerId : initialDealerId?._id;

  // Fetch dealer data if dealerId is just a string
  const { data: dealerData } = useQuery({
    queryKey: ['dealer', dealerIdStr],
    queryFn: () => getDealerById(dealerIdStr || ''),
    enabled: !!dealerIdStr && dealerIdIsString,
  });
 // console.log('dealerData', dealerData);
  // Get dealer info from fetched data or initial data
  const dealerId = dealerData?.data || (dealerIdIsString ? null : initialDealerId) || null;
//console.log('dealerId', dealerId);
  // Get unique commenterIds that need fetching
  const commenterIdsToFetch = useMemo(() => 
    Array.from(
      new Set(
        initialComments
          .filter(c => c.commenterId && !c.user)
          .map(c => c.commenterId as string)
      )
    ), [initialComments]
  );

  // Fetch all commenters' data using useQueries
  const commenterQueries = useQueries({
    queries: commenterIdsToFetch.map((commenterId) => ({
      queryKey: ['user', commenterId],
      queryFn: () => getUserById(commenterId),
      enabled: !!commenterId,
    })),
  });

  // Create a map of commenter data
  const commentersDataMap = useMemo(() => {
    const map = new Map<string, any>();
    commenterQueries.forEach((query, idx) => {
      const commenterId = commenterIdsToFetch[idx];
      if (query.data?.data) {
        map.set(commenterId, query.data.data);
      }
    });
    return map;
  }, [commenterQueries, commenterIdsToFetch]);

  // Prepare comments with properly populated user data
  const comments = useMemo(() => 
    initialComments.map((comment) => {
      if (comment.commenterId && !comment.user) {
        const commenterData = commentersDataMap.get(comment.commenterId as string);
        return {
          ...comment,
          user: commenterData ? {
            _id: commenterData._id,
            name: commenterData.fullName || commenterData.name,
            fullName: commenterData.fullName,
            profileImage: commenterData.profileImage,
            avatar: commenterData.profileImage || commenterData.avatar,
          } : undefined,
        };
      }
      return comment;
    }), 
    [initialComments, commentersDataMap]
  );

  // No need for useEffect since we're not managing local state anymore

  const { background } = colors;
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const imageUrl = media?.[0]?.url;

  const mutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      // Only invalidate queries to refetch fresh data from server
      // The UI will update automatically when the new data comes back
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['getCommunityById', post._id] });
    },
    onError: () => {
      toast.error('Failed to like the post');
    },
  });

  const mutationComment = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success('Comment posted successfully!');
      // Invalidate and refetch community posts to update the UI
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['getCommunityById', post._id] });
    },
    onError: () => {
      toast.error('Failed to post comment');
      // Invalidate queries to ensure UI is in sync with server
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['getCommunityById', post._id] });
    },
  });
  const handleLike = () => mutation.mutate(post._id);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/community/${post?._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t('checkOutThisPost'), url: shareUrl });
      } catch {
        toast.error('Error sharing');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setSnackbarOpen(true);
      } catch {
        toast.error(t('failedToCopyLink'));
      }
    }
  };

  const handleCommentSubmit = () => {
    // Simply submit the comment and let the server handle the update
    mutationComment.mutate({ postId: post._id, content: commentText });
    setCommentText('');
    setCommentModalOpen(false);
  };

  return (
    <Card
      sx={{
        width: '100%',

        p: { xs: 2, sm: 3, md: 4 },
        mx: 'auto',
        background,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            src={(dealerId as any)?.profileImage || (dealerId as any)?.avatar || '/avatar.png'} 
            alt={dealerId?.fullName || (dealerId as any)?.name || 'User'} 
          />
          <Box>
            <Typography fontWeight="bold">
              {dealerId?.fullName || (dealerId as any)?.name || 'Unknown Dealer'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <FiMoreVertical />
        </IconButton>
      </Box>

      {/* Post Image */}
      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post image"
          sx={{
            my: 2,
            borderRadius: 2,
            width: '100%',
            height: { xs: 200, sm: 250, md: 300 },
            objectFit: 'cover',
          }}
        />
      )}

      {/* Action Buttons */}
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={handleLike}
          sx={{ cursor: 'pointer' }}
        > {liked ? <FavoriteIcon color="error" fontSize="small" /> : <FiHeart color="#bfa76f" />}
          <Typography>{likes}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <FiEye color="#bfa76f" />
          <Typography>{views}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={handleShare}
          sx={{ cursor: 'pointer' }}
        >
          <FiShare2 />
          <Typography>{t('share')}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => !mutationComment.isPending && setCommentModalOpen(true)}
          sx={{ cursor: mutationComment.isPending ? 'not-allowed' : 'pointer', opacity: mutationComment.isPending ? 0.6 : 1 }}
        >
          <FiMessageCircle />
          <Typography>{mutationComment.isPending ? t('posting') : t('comment')}</Typography>
        </Box>
        <Button size="small" onClick={() => setAllCommentsModalOpen(true)}>
          {t('viewComments')} ({comments.length})
        </Button>
        {post.car && (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            onClick={() => router.push(`/cars/${car?.slug}`)}
            sx={{ cursor: 'pointer' }}
          >
            <FiInfo />
            <Typography>{t('carDetails')}</Typography>
          </Box>
        )}
      </Box>

      {/* Post Text */}
      <Box mb={1}>
        <ExpandableText text={text} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {formattedDate}
      </Typography>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={t('linkCopiedToClipboard')}
      />

      {/* Comment Dialog */}
      <Dialog open={commentModalOpen} onClose={() => setCommentModalOpen(false)} fullWidth>
        <DialogTitle>{t('writeAComment')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={commentText}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCommentText(e.target.value)}
            placeholder={t('writeYourCommentHere')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentModalOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
          >
            {t('submit')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* All Comments Dialog */}
      <Dialog
        open={allCommentsModalOpen}
        onClose={() => setAllCommentsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', bgcolor: '#f5f5f5' }}>
          {t('allComments')}
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 400, p: 2 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {comments.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ py: 2 }}
              >
                {t('noCommentsYet')}
              </Typography>
            ) : (
              [...comments, ...(mutationComment.isPending ? [{
                _id: `temp-${Date.now()}`,
                text: commentText,
                commentedAt: new Date().toISOString(),
                user: {
                  _id: user?._id || '',
                  name: user?.fullName || 'You',
                  avatar: user?.profileImage || '/avatar.png',
                },
              }] : [])].map((comment: CommentInfo, index: number) => (
                <Box key={comment._id || index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        src={comment.user?.avatar || comment.user?.profileImage || '/avatar.png'}
                        alt={comment.user?.name || comment.user?.fullName || 'Anonymous'}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.user?.name || comment.user?.fullName || 'Anonymous'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mb: 0.5 }}
                          >
                            {comment.text}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {moment(comment.commentedAt).format(
                              'MMMM Do YYYY, h:mm A',
                            )}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index !== comments.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setAllCommentsModalOpen(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Car Details Dialog */}
      <Dialog
        open={carModalOpen}
        onClose={() => setCarModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: '#E3F2FD',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            bgcolor: '#1976D2',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            px: 3,
            py: 2,
          }}
        >
          {t('carDetails')}
          <IconButton
            onClick={() => setCarModalOpen(false)}
            sx={{ color: 'white', '&:hover': { color: '#BBDEFB' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3, px: 3 }}>
          {post.car ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">
                <strong>{t('model')}:</strong> {post.car.model}
              </Typography>
              <Typography variant="subtitle1">
                <strong>{t('type')}:</strong> {post.car.type}
              </Typography>
              <Typography variant="subtitle1">
                <strong>{t('year')}:</strong> {post.car.year}
              </Typography>
              {post.car?.features && post.car.features.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong>{t('features')}:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {post.car.features?.map((feature: string, index: number) => (
                      <Chip
                        key={index}
                        label={feature}
                        variant="outlined"
                        sx={{ fontWeight: '500' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">{t('noCarDetailsAvailable')}</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setCarModalOpen(false)}
            variant="outlined"
            color="primary"
          >
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;

