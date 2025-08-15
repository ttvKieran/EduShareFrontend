import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../configs/system';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Grid,
  Divider,
  Avatar,
  Rating,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Alert,
  Stack,
  Breadcrumbs,
  Link,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Pagination,
  CircularProgress
} from '@mui/material';
import {
  Download,
  BookmarkBorder,
  Visibility as ViewIcon,
  Share,
  Visibility,
  Person,
  School,
  CalendarToday,
  Language,
  FilePresent,
  ExpandMore,
  PlayArrow,
  Description,
  Quiz,
  Assignment,
  NavigateNext,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Comment,
  Send,
  VerifiedUser,
  TrendingUp,
  EmojiEvents,
  School as SchoolIcon,
  AccessTime,
  InsertDriveFile,
  Assessment,
  BarChart,
  Analytics
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import DocumentPreview from '../DocumentPreview';
import CommentItem from '../CommentItem';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function DocumentDetailPage() {
  const { authenticatedFetch, currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [document, setDocument] = useState();
  const params = useParams();
  const documentId = params.documentId;
  const [previewOpen, setPreviewOpen] = useState(false);

  const [newReview, setNewReview] = useState({ comment: '' });
  
  // State cho comments từ database
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [commentPagination, setCommentPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 3
  });

  // Fetch comments từ database
  const fetchComments = async (page = 1) => {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      
      const response = await authenticatedFetch(
        `${API_BASE_URL}/student/feedbacks/${documentId}?page=${page}&limit=${commentPagination.limit}`
      );
      
      if (!response.ok) {
        throw new Error('Không thể tải bình luận');
      }
      
      const result = await response.json();
      console.log(result);
      
      if (result.success) {
        setComments(result.data.feedbacks);
        setCommentPagination(result.data.pagination);
      } else {
        throw new Error(result.message || 'Lỗi khi tải bình luận');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentsError(error.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Submit comment mới
  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      toast.warning('Vui lòng viết bình luận');
      return;
    }
    
    try {
      setSubmitLoading(true);
      const response = await authenticatedFetch(
        `${API_BASE_URL}/student/feedbacks/${documentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comment: newReview.comment,
            position: 'Sinh viên'
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Không thể gửi bình luận');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setNewReview({ comment: '' });
        // Refresh comments sau khi tạo mới
        await fetchComments(1);
        toast.success('Đăng bình luận thành công!');
      } else {
        throw new Error(result.message || 'Lỗi khi gửi bình luận');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  
  // Tính toán các đơn vị thời gian
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Logic hiển thị theo yêu cầu
  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else {
    // Nếu quá 24 giờ thì hiển thị ngày tháng
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};
  // Fetch document details
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await authenticatedFetch(`${API_BASE_URL}/student/documents/${documentId}`);
        if (!response.ok) {
          throw new Error("Failed");
        } else {
          const res = await response.json();
          setDocument(res.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchDocuments();
  }, [documentId, authenticatedFetch]);

  // Fetch comments khi component mount
  useEffect(() => {
    if (documentId) {
      fetchComments(1);
    }
  }, [documentId]);

  // Xử lý thay đổi trang bình luận
  const handleCommentPageChange = (event, value) => {
    fetchComments(value);
  };

  // Transform comments data để match với format cũ
  // const transformCommentData = (comment) => {
  //   const reviewer = comment.reviewer;
  //   const replies = comment.reply;
  //   console.log("This is comment from backend: ", comment);
  //   return {
  //     id: comment._id,
  //     documentId: comment.documentId,
  //     user: {
  //       name: reviewer.name || 'Unknown User',
  //       avatar: reviewer?.name?.charAt(0).toUpperCase() || 'U',
  //       isVerified: reviewer?.role === 'lecturer' || reviewer?.role === 'admin',
  //       year: comment.reviewer?.position || 'Sinh viên'
  //     },
  //     comment: comment.comment,
  //     createdAt: comment.createdAt,
  //     // replies: comment.reply?.map(reply => ({
  //     //   id: reply.feedbackId._id || `reply_${Date.now()}_${Math.random()}`,
  //     //   comment: reply.feedbackId.comment,
  //     //   position: reply.feedbackId.position,
  //     //   reviewerName: reply.feedbackId.reviewerId?.fullName || 'Unknown User', 
  //     //   createdAt: reply.feedbackId.createdAt,
  //     //   likeCount: reply.feedbackId.likeCount || 0,
  //     //   user: {
  //     //     name: reply.feedbackId.reviewer?.name || 'Unknown User',
  //     //     avatar: (reply.feedbackId.reviewer?.name || 'U').charAt(0).toUpperCase(),
  //     //     isVerified: reply.feedbackId.reviewer?.role === 'lecturer' || reply.reviewerId?.role === 'admin',
  //     //     year: reply.feedbackId.position || 'Sinh viên'
  //     //   }
  //     // })) || []
  //     replies: comment.reply,
  //     // helpful: 0, // Có thể thêm field này vào model sau
  //     // replies: 0  // Có thể thêm field này vào model sau
  //   };
  // };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await authenticatedFetch(`${API_BASE_URL}/student/documents/${document?._id}/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const result = await response.json();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (result.success) {
        const link = window.document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = result.data.title;
        link.target = '_blank';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        
        toast.success('Tải xuống thành công!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(`Lỗi khi tải xuống tài liệu: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', pt: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ width: '100%' }}>
            <Grid item xs={12} md={8} sx={{ width: '100%' }}>

              {/* Card 1: Thông tin chi tiết tài liệu */}
              <Card elevation={2} sx={{ mb: 3, borderRadius: '5px' }}>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    {/* Phần trái - Ảnh và thông tin cơ bản */}
                    <Grid item xs={12} md={4}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={document?.thumbnail || '/document.png'}
                        alt={document?.title}
                        sx={{
                          borderRadius: '5px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          mb: 2,
                          objectFit: 'cover'
                        }}
                      />

                      {/* Action buttons */}
                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          onClick={handleDownload}
                          fullWidth
                          disabled={isDownloading}
                          sx={{
                            bgcolor: '#d32f2f',
                            '&:hover': { bgcolor: '#b71c1c' },
                            py: 1.5
                          }}
                        >
                          {isDownloading ? 'Đang tải...' : 'Tải xuống'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => setPreviewOpen(true)}
                          fullWidth
                          sx={{
                            borderColor: '#d32f2f',
                            color: '#666',
                            '&:hover': { borderColor: '#b71c1c', bgcolor: '#ffebee' }
                          }}
                        >
                          Xem trước
                        </Button>
                      </Stack>

                      {isDownloading && (
                        <Box sx={{ mt: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={downloadProgress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: '#ffebee',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#d32f2f'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ mt: 1, color: '#666', textAlign: 'center' }}>
                            {downloadProgress}% hoàn thành
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Phần phải - Thông tin chi tiết */}
                    <Grid item xs={12} md={8}>
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 1,
                          fontSize: { xs: '1.8rem', md: '2.2rem' }
                        }}
                      >
                        {document?.title || 'Đang tải...'}
                      </Typography>

                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 3, fontWeight: 400 }}
                      >
                        {document?.type || 'Tài liệu học tập'}
                      </Typography>

                      {/* Thông tin tác giả và xuất bản */}
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ mr: 1, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              Tác giả
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {document?.authors?.[0]?.name || 'Chưa có thông tin'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ mr: 1, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              Ngày xuất bản
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {document?.publishedAt ? new Date(document.publishedAt).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Language sx={{ mr: 1, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              Ngôn ngữ
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {document?.language || 'Tiếng Việt'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <School sx={{ mr: 1, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              Chuyên ngành
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {document?.subject || 'Công nghệ thông tin'}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Mô tả chi tiết */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Mô tả chi tiết
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#555' }}>
                          {document?.description || 'Tài liệu cung cấp kiến thức toàn diện và chi tiết về chủ đề được đề cập, phù hợp cho việc học tập và nghiên cứu. Nội dung được biên soạn dựa trên các nguồn tài liệu uy tín và cập nhật theo xu hướng mới nhất trong lĩnh vực.'}
                        </Typography>
                      </Box>

                      {/* Thông tin file và thống kê */}
                      <Box sx={{ mb: 3 }}>
                        <Card sx={{ p: 2, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <InsertDriveFile sx={{ mr: 1, color: '#d32f2f' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Thông tin file & Thống kê
                            </Typography>
                          </Box>

                          <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ textAlign: 'center', paddingBottom: 1, paddingTop: 1, paddingRight: 2, paddingLeft: 2, bgcolor: '#e3f2fd', borderRadius: '5px', border: '1px solid #2196f3' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <InsertDriveFile sx={{ fontSize: '20px', color: '#1976d2', mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Định dạng
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1rem' }}>
                                  {document?.fileType?.toUpperCase() || 'PDF'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ textAlign: 'center', paddingBottom: 1, paddingTop: 1, paddingRight: 2, paddingLeft: 2, bgcolor: '#f3e5f5', borderRadius: '5px', border: '1px solid #9c27b0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Assessment sx={{ fontSize: '20px', color: '#9c27b0', mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Kích thước
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#9c27b0', fontSize: '1rem' }}>
                                  {document?.fileSize ? (document.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ textAlign: 'center', paddingBottom: 1, paddingTop: 1, paddingRight: 2, paddingLeft: 2, bgcolor: '#fff3e0', borderRadius: '5px', border: '1px solid #ffcc02' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Download sx={{ fontSize: '20px', color: '#f57c00', mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Lượt tải
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f57c00', fontSize: '1rem' }}>
                                  {document?.downloadCount || '0'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ textAlign: 'center', paddingBottom: 1, paddingTop: 1, paddingRight: 2, paddingLeft: 2, bgcolor: '#e8f5e8', borderRadius: '5px', border: '1px solid #4caf50' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Visibility sx={{ fontSize: '20px', color: '#4caf50', mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Lượt xem
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50', fontSize: '1rem' }}>
                                  {document?.viewCount || '0'}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Card 2: Phần bình luận */}
              <Card elevation={2} sx={{ borderRadius: '5px' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#000' }}>
                      Bình luận về tài liệu
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {commentPagination.total} bình luận
                    </Typography>
                  </Box>

                  {/* Form viết bình luận */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      mb: 4,
                      bgcolor: '#fff',
                      border: '2px solid #f5f5f5',
                      borderRadius: '5px',
                      '&:focus-within': {
                        borderColor: '#d32f2f'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
                      Viết bình luận
                    </Typography>

                    <Box sx={{ display: 'flex', mb: 3 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: '#d32f2f',
                          width: 40,
                          height: 40,
                          fontWeight: 600
                        }}
                      >
                        {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="Chia sẻ ý kiến của bạn về tài liệu này..."
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          disabled={submitLoading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '5px',
                              '&.Mui-focused fieldset': {
                                borderColor: '#d32f2f'
                              }
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleSubmitReview}
                            disabled={!newReview.comment.trim() || submitLoading}
                            startIcon={submitLoading && <CircularProgress size={16} />}
                            sx={{
                              bgcolor: '#d32f2f',
                              color: '#fff',
                              px: 3,
                              py: 1,
                              borderRadius: '5px',
                              '&:hover': {
                                bgcolor: '#b71c1c'
                              },
                              '&:disabled': {
                                bgcolor: '#ccc'
                              }
                            }}
                          >
                            {submitLoading ? 'Đang gửi...' : 'Đăng bình luận'}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Danh sách bình luận */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', mb: 3 }}>
                      Tất cả bình luận
                    </Typography>

                    {commentsLoading && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Đang tải bình luận...</Typography>
                      </Box>
                    )}

                    {commentsError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {commentsError}
                        <Button 
                          onClick={() => fetchComments(commentPagination.page)}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          Thử lại
                        </Button>
                      </Alert>
                    )}

                    {!commentsLoading && !commentsError && (
                      <Stack spacing={3}>
                        {comments.map((comment) => (
                          <CommentItem
                            key={comment._id}
                            comment={comment}
                            formatTimeAgo={formatTimeAgo}
                          />
                        ))}
                      </Stack>
                    )}

                    {comments.length === 0 && !commentsLoading && !commentsError && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">
                          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </Typography>
                      </Box>
                    )}

                    {/* Phân trang bình luận */}
                    {commentPagination.pages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                          count={commentPagination.pages}
                          page={commentPagination.page}
                          onChange={handleCommentPageChange}
                          color="primary"
                          size="large"
                          showFirstButton
                          showLastButton
                          disabled={commentsLoading}
                          sx={{
                            '& .MuiPaginationItem-root': {
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* Hiển thị thông tin phân trang */}
                    {commentPagination.total > 0 && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        {/* <Typography variant="body2" color="text.secondary">
                          Hiển thị {((commentPagination.page - 1) * commentPagination.limit) + 1} - {Math.min(commentPagination.page * commentPagination.limit, commentPagination.total)} 
                          {' '}trong tổng số {commentPagination.total} bình luận
                        </Typography> */}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {document && (
        <DocumentPreview
          doc={document}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}