import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Chip,
    Avatar,
    Box,
    Badge,
    Menu,
    MenuItem,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    Alert
} from '@mui/material';
import {
    Description,
    InsertDriveFile,
    Image,
    PictureAsPdf,
    Schedule,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const LecturerDocumentCard = ({ 
    document, 
    onPreview, 
    onDownload, 
    onEdit, 
    onDelete, 
    onTogglePublish 
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        type: '',
        category: '',
        tags: '',
        isPublished: false
    });

    // Initialize edit form when opening dialog
    const handleEditClick = () => {
        setEditForm({
            title: document.title || '',
            description: document.description || '',
            type: document.type || '',
            category: document.category || '',
            tags: document.tags ? document.tags.join(', ') : '',
            isPublished: document.isPublished || false
        });
        setEditDialogOpen(true);
    };

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle save changes
    const handleSaveChanges = () => {
        const updatedDocument = {
            ...document,
            title: editForm.title,
            description: editForm.description,
            type: editForm.type,
            category: editForm.category,
            tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            isPublished: editForm.isPublished,
            updatedAt: new Date().toISOString()
        };
        
        onEdit(updatedDocument);
        setEditDialogOpen(false);
        console.log('Document updated:', updatedDocument);
    };

    // Helper functions
    const getFileIcon = (document) => {
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

    const getTypeColor = (type) => {
        switch (type) {
            case 'lecture': return 'primary';
            case 'exercise': return 'success';
            case 'reference': return 'warning';
            case 'curriculum': return 'primary';
            case 'exam': return 'error';
            default: return 'default';
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

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (action) => {
        handleMenuClose();
        action();
    };

    return (
        <>
            <Card
                elevation={2}
                sx={{
                    height: '100%',
                    borderRadius: '5px',
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
                            {getFileIcon(document)}
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
                        <IconButton 
                            size="small"
                            onClick={handleMenuOpen}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                            label={getTypeLabel(document.type)}
                            size="small"
                            color={getTypeColor(document.type)}
                            variant="outlined"
                            sx={{ borderRadius: '2px' }}
                        />
                        <Chip
                            label={document.fileType?.toUpperCase()}
                            size="small"
                            variant="filled"
                            sx={{ bgcolor: 'grey.200', color: 'text.primary', borderRadius: '2px' }}
                        />
                        <Chip
                            label={document.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                            size="small"
                            color={document.isPublished ? 'success' : 'default'}
                            variant="filled"
                            sx={{ borderRadius: '2px' }}
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
                            <Badge badgeContent={document.viewCount} color="primary" max={999}>
                                <VisibilityIcon sx={{ fontSize: 18, color: '#666' }} />
                            </Badge>
                            <Badge badgeContent={document.downloadCount} color="secondary" max={999}>
                                <DownloadIcon sx={{ fontSize: 18, color: '#666' }} />
                            </Badge>
                        </Box>
                    </Box>

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                            {document.tags.slice(0, 3).map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            ))}
                        </Box>
                    )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => onPreview(document)}
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
                        Xem
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => onDownload(document)}
                        sx={{
                            borderColor: '#2e7d32',
                            color: '#2e7d32',
                            '&:hover': {
                                borderColor: '#1b5e20',
                                backgroundColor: '#e8f5e8'
                            },
                            fontSize: '10px'
                        }}
                    >
                        Tải về
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            },
                            fontSize: '10px'
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                </CardActions>
            </Card>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleMenuClick(() => onPreview(document))}>
                    <VisibilityIcon sx={{ mr: 2 }} />
                    Xem trước
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick(() => onDownload(document))}>
                    <DownloadIcon sx={{ mr: 2 }} />
                    Tải xuống
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick(handleEditClick)}>
                    <EditIcon sx={{ mr: 2 }} />
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick(() => onTogglePublish(document))}>
                    {document.isPublished ? <VisibilityOffIcon sx={{ mr: 2 }} /> : <VisibilityIcon sx={{ mr: 2 }} />}
                    {document.isPublished ? 'Ẩn tài liệu' : 'Xuất bản'}
                </MenuItem>
                <Divider />
                <MenuItem 
                    onClick={() => handleMenuClick(() => onDelete(document))}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon sx={{ mr: 2 }} />
                    Xóa tài liệu
                </MenuItem>
            </Menu>

            {/* Edit Document Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon />
                        Chỉnh sửa tài liệu
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Bạn chỉ có thể chỉnh sửa thông tin mô tả, không thể thay đổi file gốc. 
                        Để thay đổi file, vui lòng tải lên tài liệu mới.
                    </Alert>
                    
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề tài liệu"
                                value={editForm.title}
                                onChange={(e) => handleFormChange('title', e.target.value)}
                                required
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại tài liệu</InputLabel>
                                <Select
                                    value={editForm.type}
                                    label="Loại tài liệu"
                                    onChange={(e) => handleFormChange('type', e.target.value)}
                                >
                                    <MenuItem value="lecture">Bài giảng</MenuItem>
                                    <MenuItem value="exercise">Bài tập</MenuItem>
                                    <MenuItem value="reference">Tài liệu tham khảo</MenuItem>
                                    <MenuItem value="curriculum">Giáo trình</MenuItem>
                                    <MenuItem value="exam">Đề thi</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    value={editForm.category}
                                    label="Danh mục"
                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                >
                                    <MenuItem value="curriculum">Giáo trình</MenuItem>
                                    <MenuItem value="lecture">Bài giảng</MenuItem>
                                    <MenuItem value="exercise">Bài tập</MenuItem>
                                    <MenuItem value="reference">Tài liệu tham khảo</MenuItem>
                                    <MenuItem value="exam">Đề thi</MenuItem>
                                    <MenuItem value="guide">Hướng dẫn</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                multiline
                                rows={4}
                                value={editForm.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                placeholder="Mô tả nội dung tài liệu..."
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tags (phân cách bằng dấu phẩy)"
                                value={editForm.tags}
                                onChange={(e) => handleFormChange('tags', e.target.value)}
                                placeholder="ví dụ: java, oop, programming, exercise"
                                helperText="Các từ khóa giúp tìm kiếm tài liệu dễ dàng hơn"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editForm.isPublished}
                                        onChange={(e) => handleFormChange('isPublished', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Xuất bản tài liệu (sinh viên có thể xem)"
                            />
                        </Grid>
                        
                        {/* File Info Display */}
                        <Grid item xs={12}>
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'grey.50', 
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    📎 Thông tin file gốc
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Tên file:
                                        </Typography>
                                        <Typography variant="body2">
                                            {document.originalName || 'document.' + document.fileType}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Kích thước:
                                        </Typography>
                                        <Typography variant="body2">
                                            {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Loại file:
                                        </Typography>
                                        <Typography variant="body2">
                                            {document.fileType?.toUpperCase()} - {document.mimeType}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Ngày tải lên:
                                        </Typography>
                                        <Typography variant="body2">
                                            {new Date(document.createdAt).toLocaleString('vi-VN')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                * Các trường bắt buộc
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                onClick={() => setEditDialogOpen(false)}
                                variant="outlined"
                                startIcon={<CancelIcon />}
                            >
                                Hủy
                            </Button>
                            <Button 
                                onClick={handleSaveChanges}
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={!editForm.title.trim()}
                            >
                                Lưu thay đổi
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LecturerDocumentCard;