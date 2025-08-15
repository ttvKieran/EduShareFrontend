import React, { useState, useMemo } from 'react';
import API_BASE_URL from "../../../configs/system";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardActions,
  Button,
  Chip,
  Avatar,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from '@mui/material';
import {
  Visibility,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Download,
  Schedule,
  PictureAsPdf,
  Image,
  Description,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  InsertDriveFile,
  Favorite,
  FavoriteBorder,
  Info,
  Close,
  CloudDownload,
  Folder,
  DateRange,
  Storage
} from '@mui/icons-material';
import DocumentPreview from '../DocumentPreview';
import { useNavigate } from 'react-router-dom';
import {useFavorite} from '../../../contexts/FavoriteContext';
import { useAuth } from '../../../contexts/AuthContext';

const DocumentCard = ({ document }) => {
  const { authenticatedFetch } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);
  // const [isFavorited, setIsFavorited] = useState(document.isFavorited || false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const navigate = useNavigate();

  const { isFavorited, toggleFavorite, initialized } = useFavorite();
  
  // Sử dụng useMemo để tránh re-render không cần thiết
  const isDocumentFavorited = useMemo(() => {
    if (!initialized || !document?._id) return false;
    return isFavorited(document._id);
  }, [isFavorited, document?._id, initialized]);

  const handleFavorite = async () => {
    if (favoriteLoading || !document?._id) return;
    setFavoriteLoading(true);
    
    try {
      await toggleFavorite(document._id);
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getFileIcon = () => {
    const iconProps = { sx: { fontSize: '2rem' } };

    if (document.mimeType?.startsWith('image/')) {
      return <Image color="success" {...iconProps} />;
    }
    if (document.mimeType === 'application/pdf') {
      return <PictureAsPdf color="error" {...iconProps} />;
    }
    if (document.mimeType?.includes('word')) {
      return <Description color="primary" {...iconProps} />;
    }
    if (document.mimeType?.includes('excel')) {
      return <Description color="success" {...iconProps} />;
    }
    if (document.mimeType?.includes('sheet')) {
      return <Description color="success" {...iconProps} />;
    }
    if (document.mimeType?.includes('presentation')) {
      return <Description color="warning" {...iconProps} />;
    }
    return <InsertDriveFile color="action" {...iconProps} />;
  };

  const getTypeColor = () => {
    switch (document.type) {
      case 'lecture': return 'primary';
      case 'exercise': return 'success';
      case 'reference': return 'warning';
      case 'curriculum': return 'primary';
      default: return 'default';
    }
  };

  const getTypeLabel = () => {
    switch (document.type) {
      case 'lecture': return 'Bài giảng';
      case 'exercise': return 'Bài tập';
      case 'reference': return 'Tài liệu tham khảo';
      case 'curriculum': return 'Giáo trình';
      case 'exam': return 'Đề thi';
      default: return 'Khác';
    }
  };

  const handleDocumentDetail = () => {
    navigate(`/document-detail/${document._id}`);
  }

  const handleDownload = async () => {
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/student/documents/${document._id}/download`);

      const result = await res.json();
      if (result.success) {
        const link = window.document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = result.data.title;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Lỗi khi tải xuống tài liệu: ${error.message}`);
    }
  };

  // const handleFavorite = async () => {
  //   if (favoriteLoading) return;
  //   setFavoriteLoading(true);
  //   try {
  //     const method = isFavorited ? 'DELETE' : 'POST';
  //     const res = await fetch(`${API_BASE_URL}/student/documents/${document._id}/favorite`, {
  //       method: method,
  //       headers: { 
  //         Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     const result = await res.json();
  //     if (result.success) {
  //       setIsFavorited(!isFavorited);
  //     } else {
  //       alert(result.message || 'Có lỗi xảy ra');
  //     }
  //   } catch (error) {
  //     alert(`Lỗi: ${error.message}`);
  //   } finally {
  //     setFavoriteLoading(false);
  //   }
  // };

  return (
    <>
      <Card
        elevation={2}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            elevation: 8,
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }
        }}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: '#f5f5f5' }}>
              {getFileIcon()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.3,
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {document.title}
              </Typography>
            </Box>
            {/* Favorite Button */}
            {/* <Tooltip title={isDocumentFavorited ? "Bỏ yêu thích" : "Yêu thích"}>
              <IconButton
                onClick={handleFavorite}
                disabled={favoriteLoading}
                sx={{
                  color: isDocumentFavorited ? '#f44336' : '#bdbdbd',
                  '&:hover': {
                    color: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)'
                  }
                }}
              >
                {isDocumentFavorited ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip> */}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              label={getTypeLabel()}
              size="small"
              color={getTypeColor()}
              variant="outlined"
              sx={{ borderRadius: '2px' }}
            />
            <Chip
              label={document.fileType?.toUpperCase()}
              size="small"
              variant="filled"
              sx={{ bgcolor: 'grey.200', color: 'text.primary', borderRadius: '2px' }}
            />
          </Box>

          {/* Description */}
          {document.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '3em'
              }}
            >
              {document.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {document.authors[0]?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Schedule sx={{ fontSize: 16, mr: 1, color: '#666' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(document.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Kích thước: {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, marginRight: 2 }}>
              <Badge badgeContent={document.viewCount} color="primary" max={999} >
                <ViewIcon sx={{ fontSize: 18, color: '#666' }} />
              </Badge>
              <Badge badgeContent={document.downloadCount} color="secondary" max={999}>
                <DownloadIcon sx={{ fontSize: 18, color: '#666' }} />
              </Badge>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Info />}
            onClick={handleDocumentDetail}
            sx={{
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: '#e3f2fd'
              },
              fontSize: '10px'
            }}
          >
            Chi tiết
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': {
                borderColor: '#b71c1c',
                backgroundColor: '#ffebee'
              },
              fontSize: '10px'
            }}
          >
            Xem
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              },
              fontSize: '10px'
            }}
          >
            Tải về
          </Button>
        </CardActions>
      </Card>

      {/* Document Preview Dialog */}
      <DocumentPreview
        doc={document}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default DocumentCard;