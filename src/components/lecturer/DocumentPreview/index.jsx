import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    Box,
    Grid,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    Edit as EditIcon
} from '@mui/icons-material';

const DocumentPreview = ({ 
    document, 
    open, 
    onClose, 
    onDownload, 
    onEdit,
    showEditButton = true 
}) => {
    if (!document) return null;

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { height: '90vh' } }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {document.title}
                </Typography>
                <IconButton 
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {document.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                {document.tags?.map((tag) => (
                                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Loại:</strong> {getTypeLabel(document.type)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Kích thước:</strong> {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Tác giả:</strong> {document.authors[0]?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Ngày tạo:</strong> {new Date(document.createdAt).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Box sx={{ p: 3, textAlign: 'center', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        📄 Xem trước tài liệu
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => onDownload(document)}
                >
                    Tải xuống
                </Button>
                {showEditButton && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(document)}
                    >
                        Chỉnh sửa
                    </Button>
                )}
                <Button onClick={onClose}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentPreview;