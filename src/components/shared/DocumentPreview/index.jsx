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
  Alert
} from '@mui/material';
import {
  Download,
  Visibility,
  Close,
  PictureAsPdf,
  Image,
  InsertDriveFile,
  Description,
  Refresh
} from '@mui/icons-material';
import API_BASE_URL from "../../../configs/system";
import { useAuth } from '../../../contexts/AuthContext';

const DocumentPreview = ({ doc, open, onClose }) => {
  const { authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [usesFallback, setUsesFallback] = useState(false);

  useEffect(() => {
    if (open && doc?._id) {
      handlePreview();
    }
  }, [open, doc]);

  const handlePreview = async () => {
    if (!doc.isPreviewable) {
      setError('Tài liệu này không thể xem trước');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUsesFallback(false);

      const response = await authenticatedFetch(`${API_BASE_URL}/student/documents/${doc._id}/preview`);

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

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          width: '100%'
        }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Đang tải xem trước...</Typography>
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
          <Alert severity="error" sx={{ mb: 2, maxWidth: '500px' }}>
            {error}
          </Alert>

          {/* Hiển thị nút thử fallback cho Office files */}
          {previewData?.fallbackPreviewUrl && !usesFallback && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleUseFallback}
              sx={{ mb: 2 }}
            >
              Thử phương thức xem khác
            </Button>
          )}

          <Typography variant="body2" color="text.secondary">
            Một số gợi ý:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Tài liệu Office có thể cần thời gian để tải
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Thử tải xuống để xem offline
          </Typography>
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
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="body1">Không có dữ liệu xem trước</Typography>
        </Box>
      );
    }

    // Xử lý preview theo loại file
    if (previewData.mimeType?.startsWith('image/')) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          p: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <img
            src={previewData.previewUrl}
            alt={previewData.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
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
        display: 'flex'
      }}>
        <iframe
          src={previewData.previewUrl}
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
    const iconProps = { sx: { fontSize: '2rem' } };

    if (doc.mimeType?.startsWith('image/')) {
      return <Image color="success" {...iconProps} />;
    }
    if (doc.mimeType === 'application/pdf') {
      return <PictureAsPdf color="error" {...iconProps} />;
    }
    if (doc.mimeType?.includes('word')) {
      return <Description color="primary" {...iconProps} />;
    }
    if (doc.mimeType?.includes('excel')) {
      return <Description color="success" {...iconProps} />;
    }
    if (doc.mimeType?.includes('sheet')) {
      return <Description color="success" {...iconProps} />;
    }
    if (doc.mimeType?.includes('presentation')) {
      return <Description color="warning" {...iconProps} />;
    }
    return <InsertDriveFile color="action" {...iconProps} />;
  };

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
        p: 2,
        minHeight: 'auto',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            {getFileIcon()}
            <Typography 
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
                minWidth: 0
              }}
            >
              {doc?.title}
            </Typography>
            <Chip
              label={doc?.fileType?.toUpperCase()}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ borderRadius: '2px', flexShrink: 0 }}
            />
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ flexShrink: 0, ml: 1 }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 0,
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 0 // Trick để force DialogContent sử dụng flex: 1
      }}>
        {renderPreviewContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;