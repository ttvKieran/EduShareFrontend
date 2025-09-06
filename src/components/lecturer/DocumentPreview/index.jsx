import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
  Grid,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Download,
  Visibility,
  Close,
  PictureAsPdf,
  Image,
  InsertDriveFile,
  Description,
  Refresh,
  Person,
  AccessTime,
  RemoveRedEye,
  GetApp,
  FilePresent,
  Category,
  Edit,
  Share,
  Fullscreen,
  Print
} from '@mui/icons-material';
import API_BASE_URL from "../../../configs/system";
import { useAuth } from '../../../contexts/AuthContext';

const DocumentPreview = ({ doc, open, onClose }) => {
  console.log(doc);
  const { authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [usesFallback, setUsesFallback] = useState(false);

  useEffect(() => {
    if (open && doc?._id) {
      handlePreview();
    }
    // Reset states when dialog closes
    if (!open) {
      setPreviewData(null);
      setError(null);
      setUsesFallback(false);
    }
  }, [open, doc]);

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsesFallback(false);

      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/documents/${doc._id}/preview`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error(`Server trả về HTML thay vì JSON. Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPreviewData(result.data);
      } else {
        setError(result.message || 'Không thể xem trước tài liệu');
      }
    } catch (error) {
      setError(`Lỗi khi tải xem trước: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUseFallback = () => {
    if (previewData?.fallbackPreviewUrl) {
      setUsesFallback(true);
      setError(null);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/student/documents/${doc._id}/download`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });

      const result = await res.json();
      if (result.success) {
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = result.data.title;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Lỗi khi tải xuống tài liệu: ${error.message}`);
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'lecture': return 'Bài giảng';
      case 'exercise': return 'Bài tập';
      case 'reference': return 'Tài liệu tham khảo';
      case 'curriculum': return 'Giáo trình';
      case 'exam': return 'Đề thi';
      default: return 'Khác';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lecture': return 'primary';
      case 'exercise': return 'warning';
      case 'reference': return 'info';
      case 'curriculum': return 'success';
      case 'exam': return 'error';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Đang tải xem trước...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng chờ trong giây lát
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              maxWidth: '600px',
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error}
          </Alert>

          {previewData?.fallbackPreviewUrl && !usesFallback && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleUseFallback}
              sx={{ mb: 2 }}
              size="large"
            >
              Thử phương thức xem khác
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handlePreview}
            sx={{ mb: 3 }}
            size="large"
          >
            Thử lại
          </Button>

          <Box sx={{ maxWidth: '500px' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              💡 Gợi ý khắc phục:
            </Typography>
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary">
                • Tài liệu Office có thể cần thời gian để tải
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Kiểm tra kết nối mạng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Thử tải xuống để xem offline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Liên hệ quản trị viên nếu vấn đề vẫn tiếp tục
              </Typography>
            </Stack>
          </Box>
        </Box>
      );
    }

    if (!previewData) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FilePresent sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Không có dữ liệu xem trước
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tài liệu có thể chưa được xử lý hoặc không hỗ trợ xem trước
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handlePreview}
            size="large"
          >
            Thử lại
          </Button>
        </Box>
      );
    }

    // Xử lý preview theo loại file
    if (previewData?.mimeType?.startsWith('image/')) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          p: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}>
          <img
            src={usesFallback ? previewData.fallbackPreviewUrl : previewData.previewUrl}
            alt={previewData.title || doc?.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            onError={() => {
              if (!usesFallback && previewData.fallbackPreviewUrl) {
                setUsesFallback(true);
                setError('Đang thử phương thức xem khác...');
              } else {
                setError('Không thể tải hình ảnh. Vui lòng thử lại.');
              }
            }}
          />
        </Box>
      );
    }

    // Default iframe cho tất cả các loại file khác (PDF, Office, etc.)
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        backgroundColor: '#f8f9fa'
      }}>
        <iframe
          src={usesFallback ? previewData.fallbackPreviewUrl : previewData.previewUrl}
          width="100%"
          height="100%"
          title="Document Preview"
          frameBorder="0"
          style={{
            border: 'none',
            outline: 'none',
            display: 'block'
          }}
          onError={() => {
            if (!usesFallback && previewData.fallbackPreviewUrl) {
              setUsesFallback(true);
              setError('Đang thử phương thức xem khác...');
            } else {
              setError('Không thể hiển thị xem trước. Vui lòng tải xuống để xem.');
            }
          }}
        />
      </Box>
    );
  };

  const getFileIcon = () => {
    const iconProps = { sx: { fontSize: '2.5rem' } };

    if (doc?.mimeType?.startsWith('image/')) {
      return <Image color="success" {...iconProps} />;
    }
    if (doc?.mimeType === 'application/pdf') {
      return <PictureAsPdf color="error" {...iconProps} />;
    }
    if (doc?.mimeType?.includes('word')) {
      return <Description color="primary" {...iconProps} />;
    }
    if (doc?.mimeType?.includes('excel')) {
      return <Description color="success" {...iconProps} />;
    }
    if (doc?.mimeType?.includes('sheet')) {
      return <Description color="success" {...iconProps} />;
    }
    if (doc?.mimeType?.includes('presentation')) {
      return <Description color="warning" {...iconProps} />;
    }
    return <InsertDriveFile color="action" {...iconProps} />;
  };

  if (!doc) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen
      PaperProps={{
        sx: { 
          height: '100vh',
          width: '100vw',
          borderRadius: 0,
          margin: 0,
          maxHeight: '100vh',
          maxWidth: '100vw',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 0,
        minHeight: 'auto',
        flexShrink: 0,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {/* Header Section */}
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
              <Box sx={{ color: 'white' }}>
                {getFileIcon()}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 0.5
                  }}
                >
                  {doc?.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    label={getTypeLabel(doc?.type)}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: 500
                    }}
                  />
                  <Chip
                    label={doc?.fileType?.toUpperCase()}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      borderRadius: '12px'
                    }}
                  />
                  {usesFallback && (
                    <Chip
                      label="FALLBACK MODE"
                      size="small"
                      sx={{ 
                        backgroundColor: 'warning.main',
                        color: 'white',
                        borderRadius: '12px'
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose} 
              size="large" 
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Document Info Section */}
        {/* <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📄 Thông tin tài liệu
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {doc?.description}
              </Typography>
              
              {doc?.tags && doc.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    🏷️ Thẻ:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {doc.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '16px' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {doc?.authors && doc.authors.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    👥 Tác giả:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {doc.authors.map((author, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                          {author.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{author.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 Thống kê
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilePresent color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Kích thước</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatFileSize(doc?.fileSize)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RemoveRedEye color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Lượt xem</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {doc?.viewCount?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GetApp color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Lượt tải</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {doc?.downloadCount?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Cập nhật</Typography>
                    <Typography variant="body2">
                      {formatDate(doc?.updatedAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                    <Chip
                      label={doc?.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      size="small"
                      color={doc?.isPublished ? 'success' : 'default'}
                      sx={{ borderRadius: '12px' }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box> */}
      </DialogTitle>

      <DialogContent sx={{ 
        p: 0,
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 0
      }}>
        {renderPreviewContent()}
      </DialogContent>
      
      {/* <DialogActions sx={{ 
        p: 2, 
        backgroundColor: 'grey.50',
        flexShrink: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        gap: 1
      }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {doc?.mimeType}
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownload}
          size="large"
        >
          Tải xuống
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Edit />}
          size="large"
        >
          Chỉnh sửa
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Share />}
          size="large"
        >
          Chia sẻ
        </Button>
        
        <Button 
          variant="contained"
          onClick={onClose}
          size="large"
          sx={{ minWidth: '100px' }}
        >
          Đóng
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default DocumentPreview;