'use client';
import React, { useState } from 'react';
import { PaginatedResponse, CommunityPost, ApiResponse } from '@/types';
import CreatePostCard from '@/components/ui/CreatePostCard';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,

  Container,
  Paper,
} from '@mui/material';
import PostCard from '@/components/ui/CommunitryPostCard';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getCommunityPosts, getCommunityPostsById } from '@/lib/api/community';
import CommunityHeader from '@/components/ui/CommunityHeader';
import colors from '@/components/styles';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import DealerListSidebar from '@/components/ui/DealerListSidebar';

const CommunityScreen: React.FC = () => {
  const { t } = useTranslation();
  const { foreground } = colors;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const theme = useTheme();

  const { id } = useParams();
  const { data: postById, isLoading: isGettingData } = useQuery({
    queryFn: () => getCommunityPostsById(id as string),
    queryKey: ['getCommunityById', id],
    enabled: !!id,
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse<PaginatedResponse<CommunityPost>>>({
    queryKey: ['community-posts', searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getCommunityPosts({
        page: typeof pageParam === 'number' ? pageParam : 1,
        search: searchTerm,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.pagination?.hasMore
        ? (lastPage.data.pagination.page || 1) + 1
        : undefined;
    },
    enabled: !!searchTerm || searchTerm === '',
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: foreground,
        py: { xs: 2, md: 4 },
        maxWidth: '100%',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 0, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            top: 0,
            zIndex: 80,
            background: foreground,
            py: 2,
          }}
        >
          <CommunityHeader handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchTerm(e.target.value)} />
        </Box>

        {/* Title + Subtitle */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, px: { xs: 1, md: 0 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 600,
              fontSize: {
                xs: '28px',
                sm: '32px',
                md: '40px',
              },
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t('community')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '14px', md: '16px' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {t('connectShareDiscover')}
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 320px',
            },
            gap: { xs: 3, md: 4 },
            alignItems: 'start',
          }}
        >
          {/* Left Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Create Post Card */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            >
              <CreatePostCard />
            </Paper>

            {/* Posts */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!id ? (
                isLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      py: 8,
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : isError ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.error.light}`,
                      background: `${theme.palette.error.light}10`,
                    }}
                  >
                    <Typography color="error" variant="h6">
                      {t('failedToLoadPosts')}
                    </Typography>
                  </Paper>
                ) : (
                  data?.pages?.map((page) =>
                    page?.data?.data?.map((post: CommunityPost) => (
                      <Paper
                        key={post._id}
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: `1px solid ${theme.palette.divider}`,
                          background: theme.palette.background.paper,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <PostCard key={post._id} post={{
                          _id: post._id,
                          text: post.text || '',
                          media: post.media || [],
                          createdAt: post.createdAt,
                          dealerId: post.dealerId || post.author || '',
                          views: post.views || 0,
                          likes: post.likes.map(like => ({ _id: like, likedByUser: like })),
                          comments: post.comments.map(comment => ({
                            _id: comment._id,
                            text: comment.text || comment.content || '',
                            commentedAt: comment.createdAt,
                            commenterId: comment.commenterId || comment.author,
                            user: undefined,
                          })),
                          car: undefined,
                        }} />
                      </Paper>
                    )),
                  )
                )
              ) : (
                !isGettingData && postById?.data && (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <PostCard
                      key={postById?.data?._id}
                      post={{
                        _id: postById.data._id,
                        text: postById.data.content,
                        media: postById.data.media || [],
                        createdAt: postById.data.createdAt,
                        dealerId: postById.data.dealerId || postById.data.author || '',
                        views: postById.data.views || 0,
                        likes: postById.data.likes.map(like => ({ _id: like, likedByUser: like })),
                        comments: postById.data.comments.map(comment => ({
                          _id: comment._id,
                          text: comment.content || comment.text || '',
                          commentedAt: comment.createdAt,
                          commenterId: comment.commenterId || comment.author,
                          user: undefined,
                        })),
                        car: undefined,
                      }}
                    />
                  </Paper>
                )
              )}

              {/* Load More */}
              {hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 500,
                      minWidth: 140,
                    }}
                  >
                    {isFetchingNextPage ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={20} />
                        {t('loadingMore')}
                      </Box>
                    ) : (
                      t('loadMore')
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Sidebar for large devices */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'sticky',
              top: 100,
              height: 'fit-content',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            >
              <DealerListSidebar />
            </Paper>
          </Box>
        </Box>

        {/* Mobile Sidebar (below main content) */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
            }}
          >
            <DealerListSidebar />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default CommunityScreen;
