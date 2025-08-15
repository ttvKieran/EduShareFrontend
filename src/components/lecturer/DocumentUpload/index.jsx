import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Box,
    Grid,
    Chip,
    IconButton,
    LinearProgress,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    InsertDriveFile as FileIcon,
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    Archive as ArchiveIcon,
    Add as AddIcon,
    Check as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const DocumentUpload = ({ 
    open, 
    onClose, 
    onUpload,
    courseId = null,
    initialData = null
}) => {
    // States
    const [activeStep, setActiveStep] = useState(0);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        type: 'lecture',
        category: '',
        isPublished: true,
        allowDownload: true,
        tags: [],
        files: [],
        courseId: courseId
    });
    const [newTag, setNewTag] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const steps = ['Chọn file', 'Thông tin cơ bản', 'Cài đặt nâng cao', 'Xác nhận'];

    const documentTypes = [
        { value: 'lecture', label: 'Bài giảng', color: 'primary' },
        { value: 'exercise', label: 'Bài tập', color: 'success' },
        { value: 'reference', label: 'Tài liệu tham khảo', color: 'warning' },
        { value: 'exam', label: 'Đề thi', color: 'error' },
        { value: 'curriculum', label: 'Giáo trình', color: 'info' },
        { value: 'video', label: 'Video bài giảng', color: 'secondary' }
    ];

    const categories = [
        'Lý thuyết',
        'Thực hành',
        'Bài tập về nhà',
        'Kiểm tra',
        'Thi kết thúc',
        'Tài liệu tham khảo',
        'Video hướng dẫn',
        'Slide bài giảng'
    ];

    // File type icons
    const getFileIcon = (file) => {
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();
        
        if (type.includes('pdf')) return <PdfIcon color="error" />;
        if (type.includes('word') || name.includes('.doc')) return <DocIcon color="primary" />;
        if (type.includes('image')) return <ImageIcon color="success" />;
        if (type.includes('video')) return <VideoIcon color="secondary" />;
        if (type.includes('zip') || type.includes('rar')) return <ArchiveIcon color="warning" />;
        return <FileIcon color="action" />;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!uploadForm.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }
        
        if (uploadForm.files.length === 0) {
            newErrors.files = 'Vui lòng chọn ít nhất một file';
        }
        
        if (!uploadForm.type) {
            newErrors.type = 'Vui lòng chọn loại tài liệu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle file selection
    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = [];
        const maxSize = 100 * 1024 * 1024; // 100MB
        
        selectedFiles.forEach(file => {
            if (file.size > maxSize) {
                alert(`File ${file.name} quá lớn. Kích thước tối đa là 100MB.`);
                return;
            }
            
            validFiles.push({
                file,
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0
            });
        });
        
        setUploadForm(prev => ({
            ...prev,
            files: [...prev.files, ...validFiles]
        }));
        
        if (event.target) {
            event.target.value = '';
        }
    };

    // Remove file
    const handleRemoveFile = (fileId) => {
        setUploadForm(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== fileId)
        }));
    };

    // Add tag
    const handleAddTag = () => {
        if (newTag.trim() && !uploadForm.tags.includes(newTag.trim())) {
            setUploadForm(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    // Remove tag
    const handleRemoveTag = (tagToRemove) => {
        setUploadForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle next step
    const handleNext = () => {
        if (activeStep === 0 && uploadForm.files.length === 0) {
            setErrors({ files: 'Vui lòng chọn ít nhất một file' });
            return;
        }
        
        if (activeStep === 1 && !uploadForm.title.trim()) {
            setErrors({ title: 'Tiêu đề không được để trống' });
            return;
        }
        
        setErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setUploading(true);
        setUploadProgress(0);
        
        try {
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Call onUpload callback
            if (onUpload) {
                await onUpload(uploadForm);
            }
            
            // Reset form and close
            handleClose();
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi xảy ra khi tải file lên. Vui lòng thử lại.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle close
    const handleClose = () => {
        if (!uploading) {
            setActiveStep(0);
            setUploadForm({
                title: '',
                description: '',
                type: 'lecture',
                category: '',
                isPublished: true,
                allowDownload: true,
                tags: [],
                files: [],
                courseId: courseId
            });
            setErrors({});
            setNewTag('');
            onClose();
        }
    };

    // Step content
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Chọn tài liệu để tải lên
                        </Typography>
                        
                        {/* Upload Area */}
                        <Card 
                            sx={{ 
                                mb: 3, 
                                border: '2px dashed', 
                                borderColor: errors.files ? 'error.main' : 'grey.300',
                                bgcolor: 'grey.50',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'primary.50'
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    Kéo thả file vào đây hoặc click để chọn
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, MP4, AVI, ZIP, RAR
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Kích thước tối đa: 100MB mỗi file
                                </Typography>
                            </CardContent>
                        </Card>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.zip,.rar,.jpg,.jpeg,.png,.gif"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />

                        {errors.files && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errors.files}
                            </Alert>
                        )}

                        {/* Selected Files */}
                        {uploadForm.files.length > 0 && (
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                        Files đã chọn ({uploadForm.files.length})
                                    </Typography>
                                    <List>
                                        {uploadForm.files.map((fileData) => (
                                            <ListItem key={fileData.id} divider>
                                                <ListItemIcon>
                                                    {getFileIcon(fileData.file)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={fileData.name}
                                                    secondary={formatFileSize(fileData.size)}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton 
                                                        edge="end" 
                                                        onClick={() => handleRemoveFile(fileData.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Thông tin cơ bản
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề tài liệu *"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    placeholder="Nhập tiêu đề tài liệu..."
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors.type}>
                                    <InputLabel>Loại tài liệu *</InputLabel>
                                    <Select
                                        value={uploadForm.type}
                                        label="Loại tài liệu *"
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        {documentTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip 
                                                        size="small" 
                                                        label={type.label} 
                                                        color={type.color}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Danh mục</InputLabel>
                                    <Select
                                        value={uploadForm.category}
                                        label="Danh mục"
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    multiline
                                    rows={4}
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả ngắn về tài liệu..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Tags
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    {uploadForm.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        label="Thêm tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        placeholder="java, oop, programming..."
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddTag}
                                        startIcon={<AddIcon />}
                                        disabled={!newTag.trim()}
                                    >
                                        Thêm
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Cài đặt nâng cao
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                            Quyền truy cập
                                        </Typography>
                                        
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={uploadForm.isPublished}
                                                    onChange={(e) => setUploadForm(prev => ({ 
                                                        ...prev, 
                                                        isPublished: e.target.checked 
                                                    }))}
                                                />
                                            }
                                            label="Xuất bản ngay"
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                                            Tài liệu sẽ được xuất bản và hiển thị cho sinh viên
                                        </Typography>

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={uploadForm.allowDownload}
                                                    onChange={(e) => setUploadForm(prev => ({ 
                                                        ...prev, 
                                                        allowDownload: e.target.checked 
                                                    }))}
                                                />
                                            }
                                            label="Cho phép tải về"
                                            sx={{ mt: 2 }}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                                            Sinh viên có thể tải tài liệu về máy
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                            Thông tin bổ sung
                                        </Typography>
                                        
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            <Typography variant="body2">
                                                <strong>Lưu ý:</strong> Sau khi tải lên, bạn có thể chỉnh sửa thông tin 
                                                tài liệu, chia sẻ với các môn học khác, và theo dõi thống kê truy cập.
                                            </Typography>
                                        </Alert>

                                        <Typography variant="body2" color="text.secondary">
                                            • Tài liệu sẽ được lưu trữ an toàn trên hệ thống
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Bạn có thể thay đổi quyền truy cập bất kỳ lúc nào
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Hệ thống sẽ tự động tạo bản xem trước cho một số định dạng file
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Xác nhận thông tin
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                            Thông tin tài liệu
                                        </Typography>
                                        
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tiêu đề
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {uploadForm.title}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Loại tài liệu
                                            </Typography>
                                            <Chip 
                                                size="small" 
                                                label={documentTypes.find(t => t.value === uploadForm.type)?.label}
                                                color={documentTypes.find(t => t.value === uploadForm.type)?.color}
                                                variant="outlined"
                                            />
                                        </Box>

                                        {uploadForm.category && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Danh mục
                                                </Typography>
                                                <Typography variant="body1">
                                                    {uploadForm.category}
                                                </Typography>
                                            </Box>
                                        )}

                                        {uploadForm.description && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Mô tả
                                                </Typography>
                                                <Typography variant="body1">
                                                    {uploadForm.description}
                                                </Typography>
                                            </Box>
                                        )}

                                        {uploadForm.tags.length > 0 && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Tags
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {uploadForm.tags.map((tag) => (
                                                        <Chip
                                                            key={tag}
                                                            label={tag}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                            Files ({uploadForm.files.length})
                                        </Typography>
                                        
                                        <List dense>
                                            {uploadForm.files.map((fileData) => (
                                                <ListItem key={fileData.id}>
                                                    <ListItemIcon>
                                                        {getFileIcon(fileData.file)}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={fileData.name}
                                                        secondary={formatFileSize(fileData.size)}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Divider sx={{ my: 2 }} />

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Cài đặt
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                {uploadForm.isPublished ? (
                                                    <CheckIcon color="success" sx={{ mr: 1 }} />
                                                ) : (
                                                    <ErrorIcon color="warning" sx={{ mr: 1 }} />
                                                )}
                                                <Typography variant="body2">
                                                    {uploadForm.isPublished ? 'Xuất bản ngay' : 'Lưu dưới dạng bản nháp'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                {uploadForm.allowDownload ? (
                                                    <CheckIcon color="success" sx={{ mr: 1 }} />
                                                ) : (
                                                    <ErrorIcon color="warning" sx={{ mr: 1 }} />
                                                )}
                                                <Typography variant="body2">
                                                    {uploadForm.allowDownload ? 'Cho phép tải về' : 'Không cho phép tải về'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUploadIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Tải tài liệu lên
                    </Typography>
                </Box>
                <IconButton 
                    onClick={handleClose}
                    sx={{ color: 'white' }}
                    disabled={uploading}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {/* Stepper */}
                <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Upload Progress */}
                {uploading && (
                    <Box sx={{ p: 3, bgcolor: 'info.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <InfoIcon color="info" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                                Đang tải lên... {uploadProgress}%
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                )}

                {/* Step Content */}
                <Box sx={{ p: 3, minHeight: 400 }}>
                    {getStepContent(activeStep)}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Button 
                    onClick={handleClose}
                    disabled={uploading}
                >
                    Hủy
                </Button>
                
                <Box sx={{ flex: '1 1 auto' }} />
                
                {activeStep > 0 && (
                    <Button 
                        onClick={handleBack}
                        disabled={uploading}
                    >
                        Quay lại
                    </Button>
                )}
                
                {activeStep < steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={uploading}
                    >
                        Tiếp theo
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={uploading}
                        startIcon={uploading ? null : <CloudUploadIcon />}
                    >
                        {uploading ? 'Đang tải lên...' : 'Tải lên'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DocumentUpload;