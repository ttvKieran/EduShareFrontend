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
    Alert,
    CircularProgress,
    Snackbar,
    Autocomplete,
    Stack
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
    CloudUpload as CloudUploadIcon,
    Warning as WarningIcon,
    Add as AddIcon,
    LocalOffer as LocalOfferIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import DocumentPreview from '../DocumentPreview';
import { useAuth } from '../../../contexts/AuthContext';
import API_BASE_URL from "../../../configs/system";

const LecturerDocumentCard = ({ 
    document, 
    onPreview, 
    onDownload, 
    onEdit, 
    onDelete, 
    onTogglePublish,
    onRefresh
}) => {
    console.log("-------------\n", document);
    const { authenticatedFetch } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    
    // Delete confirmation states
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Edit loading state
    const [editLoading, setEditLoading] = useState(false);
    
    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Enhanced edit form with arrays for tags and authors
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        type: '',
        status: 'active', // 'published' hoặc 'draft'
        allowDownload: true, // Thêm trường allowDownload
        tags: [], // Array of strings
        authors: [] // Array of strings
    });

    // Validation errors
    const [formErrors, setFormErrors] = useState({
        title: '',
        authors: ''
    });

    // Predefined options for autocomplete
    const [predefinedTags] = useState([
        'Java', 'JavaScript', 'Python', 'C++', 'HTML', 'CSS', 'React', 'Node.js',
        'Database', 'SQL', 'MongoDB', 'Algorithm', 'Data Structure', 'OOP',
        'Web Development', 'Mobile App', 'AI', 'Machine Learning', 'DevOps',
        'Testing', 'Security', 'API', 'Framework', 'Library', 'Tutorial',
        'Exercise', 'Project', 'Assignment', 'Exam', 'Reference'
    ]);

    // Initialize edit form when opening dialog
    const handleEditClick = () => {
        setEditForm({
            title: document.title || '',
            description: document.description || '',
            type: document.type || '',
            status: document.isPublished ? 'active' : 'draft',
            allowDownload: document.allowDownload !== false, // Default true nếu undefined
            tags: document.tags || [],
            authors: document.authors?.map(author => 
                typeof author === 'string' ? author : author.name || author.fullName || ''
            ).filter(name => name) || []
        });
        setFormErrors({ title: '', authors: '' });
        setEditDialogOpen(true);
    };

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear validation errors when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!editForm.title.trim()) {
            errors.title = 'Tiêu đề tài liệu là bắt buộc';
        }
        
        if (editForm.authors.length === 0) {
            errors.authors = 'Phải có ít nhất một tác giả';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle save changes with API call
    const handleSaveChanges = async () => {
        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: 'Vui lòng kiểm tra lại thông tin nhập vào',
                severity: 'error'
            });
            return;
        }

        try {
            setEditLoading(true);
            
            const updateData = {
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                type: editForm.type,
                status: editForm.status,
                allowDownload: editForm.allowDownload, // Thêm allowDownload
                tags: editForm.tags,
                // Chuyển authors từ array of strings thành array of objects với thuộc tính "name"
                authors: editForm.authors
                    .filter(author => author.trim()) // Remove empty authors
                    .map(author => ({ name: author.trim() })) // Convert to object format
            };

            console.log('Updating document with data:', updateData);

            const response = await authenticatedFetch(
                `${API_BASE_URL}/lecturer/documents/${document._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Show success message
                    setSnackbar({
                        open: true,
                        message: 'Tài liệu đã được cập nhật thành công',
                        severity: 'success'
                    });

                    // Close dialog
                    setEditDialogOpen(false);

                    // Call onEdit callback if provided (for local state update)
                    if (onEdit) {
                        const updatedDocument = {
                            ...document,
                            ...updateData,
                            isPublished: updateData.status === 'active',
                            updatedAt: new Date().toISOString()
                        };
                        onEdit(updatedDocument);
                    }

                    // Refresh list
                    if (onRefresh) {
                        setTimeout(() => {
                            onRefresh();
                        }, 1000);
                    }
                } else {
                    throw new Error(result.message || 'Không thể cập nhật tài liệu');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật tài liệu');
            }
        } catch (error) {
            console.error('Error updating document:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Có lỗi xảy ra khi cập nhật tài liệu',
                severity: 'error'
            });
        } finally {
            setEditLoading(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
        handleMenuClose();
    };

    // Confirm delete document
    const confirmDeleteDocument = async () => {
        try {
            setDeleteLoading(true);
            
            const response = await authenticatedFetch(
                `${API_BASE_URL}/lecturer/documents/${document._id}`,
                {
                    method: 'DELETE'
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setSnackbar({
                        open: true,
                        message: 'Tài liệu đã được xóa thành công',
                        severity: 'success'
                    });

                    setDeleteConfirmOpen(false);

                    if (onDelete) {
                        onDelete(document);
                    }

                    if (onRefresh) {
                        setTimeout(() => {
                            onRefresh();
                        }, 1000);
                    }
                } else {
                    throw new Error(result.message || 'Không thể xóa tài liệu');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Có lỗi xảy ra khi xóa tài liệu');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Có lỗi xảy ra khi xóa tài liệu',
                severity: 'error'
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Handle snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Helper functions
    const getFileIcon = (document) => {
        const iconProps = { sx: { fontSize: '2rem' } };

        if (document.mimeType?.startsWith('image/')) {
            return <Image color="success" {...iconProps} />;
        }
        if (document.mimeType.includes('application/pdf')) {
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

    const truncateContent = (content, maxLength = 100) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
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
                        {/* <Chip
                            label={document.fileType?.toUpperCase()}
                            size="small"
                            variant="filled"
                            sx={{ bgcolor: 'grey.200', color: 'text.primary', borderRadius: '2px' }}
                        /> */}
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
                            {document.authors?.length > 0 
                                ? document.authors.map(author => 
                                    typeof author === 'string' ? author : author.name || author.fullName
                                  ).join(', ')
                                : 'Chưa có tác giả'
                            }
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
                            {document.tags.length > 3 && (
                                <Chip
                                    label={`+${document.tags.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            )}
                        </Box>
                    )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setPreviewOpen(true)}
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
                PaperProps={{
                    sx: {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        minWidth: '160px'
                    }
                }}
            >
                <MenuItem onClick={() => setPreviewOpen(true)}>
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
                <Divider />
                <MenuItem 
                    onClick={handleDeleteClick}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon sx={{ mr: 2 }} />
                    Xóa tài liệu
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => !deleteLoading && setDeleteConfirmOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <WarningIcon sx={{ color: 'error.main', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Xác nhận xóa tài liệu
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 3, fontSize: '1rem' }}>
                        Bạn có chắc chắn muốn xóa tài liệu này không?
                    </Typography>
                    
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: '#f8f9fa', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {getFileIcon(document)}
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                color: '#333'
                            }}>
                                {document.title}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {truncateContent(document.description)}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={getTypeLabel(document.type)}
                                size="small"
                                color={getTypeColor(document.type)}
                                variant="outlined"
                            />
                            <Chip
                                label={`${(document.fileSize / (1024 * 1024)).toFixed(2)} MB`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`${document.downloadCount || 0} lượt tải`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    
                    <Alert severity="error" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tài liệu và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </Typography>
                    </Alert>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        disabled={deleteLoading}
                        variant="outlined"
                        sx={{ minWidth: '100px' }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={confirmDeleteDocument}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
                        sx={{ 
                            minWidth: '140px',
                            '&:disabled': {
                                opacity: 0.7
                            }
                        }}
                    >
                        {deleteLoading ? 'Đang xóa...' : 'Xóa tài liệu'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Enhanced Edit Document Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => !editLoading && setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Chỉnh sửa tài liệu
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Bạn chỉ có thể chỉnh sửa thông tin mô tả, không thể thay đổi file gốc. 
                        Để thay đổi file, vui lòng tải lên tài liệu mới.
                    </Alert>
                    
                    <Grid container spacing={3}>
                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề tài liệu"
                                value={editForm.title}
                                onChange={(e) => handleFormChange('title', e.target.value)}
                                required
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                disabled={editLoading}
                            />
                        </Grid>
                        
                        {/* Type */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={editLoading}>
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

                        {/* Quyền truy cập Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                p: 2, 
                                border: '1px solid', 
                                borderColor: 'grey.300', 
                                borderRadius: 1,
                                bgcolor: 'grey.50'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <VisibilityIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                    Quyền truy cập
                                </Typography>
                                
                                {/* Xuất bản ngay */}
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editForm.status === 'active'}
                                            onChange={(e) => handleFormChange('status', e.target.checked ? 'active' : 'draft')}
                                            disabled={editLoading}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                Xuất bản ngay
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Tài liệu sẽ được xuất bản và hiển thị cho sinh viên
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        alignItems: 'flex-start',
                                        mb: 2,
                                        '& .MuiFormControlLabel-label': {
                                            ml: 1
                                        }
                                    }}
                                />

                                {/* Cho phép tải về */}
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editForm.allowDownload}
                                            onChange={(e) => handleFormChange('allowDownload', e.target.checked)}
                                            disabled={editLoading}
                                            color="success"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                Cho phép tải về
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Sinh viên có thể tải tài liệu về máy
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        alignItems: 'flex-start',
                                        '& .MuiFormControlLabel-label': {
                                            ml: 1
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                        
                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                multiline
                                rows={4}
                                value={editForm.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                placeholder="Mô tả nội dung tài liệu..."
                                disabled={editLoading}
                            />
                        </Grid>
                        
                        {/* Authors - Enhanced Autocomplete */}
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <PeopleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                    Tác giả *
                                </Typography>
                            </Box>
                            <Autocomplete
                                multiple
                                freeSolo
                                value={editForm.authors}
                                onChange={(event, newValue) => {
                                    handleFormChange('authors', newValue);
                                }}
                                options={[]} // No predefined options for authors
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            size="small"
                                            {...getTagProps({ index })}
                                            key={index}
                                            sx={{ margin: '2px' }}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nhập tên tác giả và nhấn Enter"
                                        placeholder={editForm.authors.length === 0 ? "Ví dụ: Nguyễn Văn A" : "Thêm tác giả khác..."}
                                        error={!!formErrors.authors}
                                        helperText={formErrors.authors || "Nhấn Enter sau khi nhập tên để thêm tác giả"}
                                        disabled={editLoading}
                                    />
                                )}
                                disabled={editLoading}
                            />
                        </Grid>
                        
                        {/* Tags - Enhanced Autocomplete */}
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <LocalOfferIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                    Tags
                                </Typography>
                            </Box>
                            <Autocomplete
                                multiple
                                freeSolo
                                value={editForm.tags}
                                onChange={(event, newValue) => {
                                    handleFormChange('tags', newValue);
                                }}
                                options={predefinedTags}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            size="small"
                                            color="primary"
                                            {...getTagProps({ index })}
                                            key={index}
                                            sx={{ margin: '2px' }}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Chọn hoặc nhập tags"
                                        placeholder={editForm.tags.length === 0 ? "Ví dụ: Java, Programming, Exercise" : "Thêm tag khác..."}
                                        helperText="Có thể chọn từ gợi ý hoặc nhập tag mới, nhấn Enter để thêm"
                                        disabled={editLoading}
                                    />
                                )}
                                disabled={editLoading}
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

                                {/* Current Status Display */}
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                    🔧 Trạng thái hiện tại
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        icon={editForm.status === 'active' ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        label={editForm.status === 'active' ? 'Đã xuất bản' : 'Bản nháp'}
                                        size="small"
                                        color={editForm.status === 'active' ? 'success' : 'default'}
                                        variant="filled"
                                    />
                                    <Chip
                                        icon={<DownloadIcon />}
                                        label={editForm.allowDownload ? 'Cho phép tải về' : 'Không cho phép tải về'}
                                        size="small"
                                        color={editForm.allowDownload ? 'success' : 'warning'}
                                        variant="outlined"
                                    />
                                </Box>
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
                                disabled={editLoading}
                            >
                                Hủy
                            </Button>
                            <Button 
                                onClick={handleSaveChanges}
                                variant="contained"
                                startIcon={editLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                                disabled={editLoading || !editForm.title.trim() || editForm.authors.length === 0}
                            >
                                {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>

            <DocumentPreview
                doc={document}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LecturerDocumentCard;