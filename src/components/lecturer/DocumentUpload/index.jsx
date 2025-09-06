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
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Autocomplete
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    InsertDriveFile as FileIcon,
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    Archive as ArchiveIcon,
    Check as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    People as PeopleIcon,
    LocalOffer as LocalOfferIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import API_BASE_URL from "../../../configs/system";

const DocumentUpload = ({ 
    open, 
    onClose, 
    onUpload,
    courseId,
    classId,
    initialData = null
}) => {
    console.log("-------------------------------/n", classId);
    const { authenticatedFetch } = useAuth();
    
    // States
    const [activeStep, setActiveStep] = useState(0);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        type: 'lecture',
        category: '',
        status: 'active', // 'active' cho xuất bản ngay, 'draft' cho bản nháp
        allowDownload: true,
        tags: [],
        authors: [], // Thêm mảng authors
        file: null, // Single file only
        courseId: courseId,
        classId: classId
    });
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

    // Predefined tags for autocomplete
    const [predefinedTags] = useState([
        'Java', 'JavaScript', 'Python', 'C++', 'HTML', 'CSS', 'React', 'Node.js',
        'Database', 'SQL', 'MongoDB', 'Algorithm', 'Data Structure', 'OOP',
        'Web Development', 'Mobile App', 'AI', 'Machine Learning', 'DevOps',
        'Testing', 'Security', 'API', 'Framework', 'Library', 'Tutorial',
        'Exercise', 'Project', 'Assignment', 'Exam', 'Reference'
    ]);

    // File type icons
    const getFileIcon = (file) => {
        if (!file) return <FileIcon color="action" />;
        
        const type = file.type?.toLowerCase() || '';
        const name = file.name?.toLowerCase() || '';
        
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
        
        if (!uploadForm.file) {
            newErrors.file = 'Vui lòng chọn file';
        }
        
        if (!uploadForm.type) {
            newErrors.type = 'Vui lòng chọn loại tài liệu';
        }

        if (uploadForm.authors.length === 0) {
            newErrors.authors = 'Phải có ít nhất một tác giả';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle file selection - single file only với size limit nhỏ hơn
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        
        // Giảm kích thước tối đa xuống 50MB để tránh lỗi 413
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (selectedFile.size > maxSize) {
            setErrors({ file: `File quá lớn. Kích thước tối đa là 50MB. File hiện tại: ${formatFileSize(selectedFile.size)}` });
            return;
        }
        
        // Kiểm tra loại file được hỗ trợ
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/avi',
            'application/zip',
            'application/x-rar-compressed'
        ];
        
        const fileName = selectedFile.name.toLowerCase();
        const isValidType = allowedTypes.includes(selectedFile.type) || 
                           fileName.endsWith('.pdf') || 
                           fileName.endsWith('.doc') || 
                           fileName.endsWith('.docx') ||
                           fileName.endsWith('.ppt') ||
                           fileName.endsWith('.pptx') ||
                           fileName.endsWith('.xls') ||
                           fileName.endsWith('.xlsx') ||
                           fileName.endsWith('.zip') ||
                           fileName.endsWith('.rar');
        
        if (!isValidType) {
            setErrors({ file: 'Loại file không được hỗ trợ. Vui lòng chọn file PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, MP4, ZIP hoặc RAR.' });
            return;
        }
        
        setUploadForm(prev => ({
            ...prev,
            file: selectedFile
        }));
        
        // Clear any existing file error
        setErrors(prev => ({ ...prev, file: '' }));
        
        // Clear input để có thể chọn lại file khác
        if (event.target) {
            event.target.value = '';
        }
    };

    // Remove file
    const handleRemoveFile = () => {
        setUploadForm(prev => ({
            ...prev,
            file: null
        }));
        setErrors(prev => ({ ...prev, file: '' }));
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
        if (activeStep === 0 && !uploadForm.file) {
            setErrors({ file: 'Vui lòng chọn file' });
            return;
        }
        
        if (activeStep === 1) {
            if (!uploadForm.title.trim()) {
                setErrors({ title: 'Tiêu đề không được để trống' });
                return;
            }
            if (uploadForm.authors.length === 0) {
                setErrors({ authors: 'Phải có ít nhất một tác giả' });
                return;
            }
        }
        
        setErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Handle submit với improved error handling
    // ...existing code...

    // Handle submit với pure FormData
    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setUploading(true);
        setUploadProgress(0);
        
        try {
            // Double check file size before upload
            if (uploadForm.file.size > 100 * 1024 * 1024) {
                throw new Error(`File quá lớn (${formatFileSize(uploadForm.file.size)}). Kích thước tối đa là 100MB.`);
            }

            // Prepare FormData - GỬI FORM DATA THUẦN TÚY
            const formData = new FormData();
            
            // Append file
            formData.append('file', uploadForm.file);
            
            // Append text fields
            formData.append('title', uploadForm.title.trim());
            formData.append('description', uploadForm.description.trim());
            formData.append('type', uploadForm.type);
            formData.append('category', uploadForm.category);
            formData.append('status', uploadForm.status);
            formData.append('allowDownload', String(uploadForm.allowDownload));
            if(classId) formData.append('classId', classId);
            else if(courseId) formData.append('courseId', courseId);
            

            // JSON fields as strings
            formData.append('tags', JSON.stringify(uploadForm.tags));
            
            // Authors as array of objects with name property
            const authorsData = uploadForm.authors
                .filter(author => author.trim())
                .map(author => ({ name: author.trim() }));
            formData.append('authors', JSON.stringify(authorsData));
            
            // Determine isForClass based on classId/courseId
            if (classId) {
                formData.append('isForClass', 'true');
            } else if (courseId) {
                formData.append('isForClass', 'false');
            }

            // Determine API endpoint
            const apiId = classId || courseId;
            const apiUrl = `${API_BASE_URL}/lecturer/documents/upload/${apiId}`;

            console.log('Uploading to:', apiUrl);
            console.log('File size:', formatFileSize(uploadForm.file.size));
            console.log('File type:', uploadForm.file.type);
            
            // Log FormData contents (for debugging)
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                if (key === 'file') {
                    console.log(key, `File: ${value.name} (${formatFileSize(value.size)})`);
                } else {
                    console.log(key, value);
                }
            }

            // console.log("------\n", [...formData.entries()]);

            // Upload với XMLHttpRequest để track progress
            const uploadPromise = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                // Setup progress tracking
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        setUploadProgress(percentComplete);
                    }
                });
                
                // Setup response handlers
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (error) {
                            reject(new Error('Invalid response format'));
                        }
                    } else {
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse.message || `HTTP ${xhr.status}`));
                        } catch {
                            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                        }
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.addEventListener('timeout', () => {
                    reject(new Error('Upload timeout'));
                });
                
                // Get token for authorization
                const token = sessionStorage.getItem('accessToken');
                
                // Open request
                xhr.open('POST', apiUrl);
                
                // Set headers
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                // DON'T set Content-Type for FormData - let browser handle it
                
                // Set timeout (5 minutes for large files)
                xhr.timeout = 5 * 60 * 1000;
                
                // Send the form data
                xhr.send(formData);
            });

            const result = await uploadPromise;
            
            if (result.success) {
                setUploadProgress(100);
                
                // Success - wait a moment then close
                setTimeout(() => {
                    if (onUpload) {
                        onUpload(result.data);
                    }
                    handleClose();
                }, 1000);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
            
        } catch (error) {
            console.error('Upload error:', error);
            setUploadProgress(0);
            
            // Show user-friendly error message
            let errorMessage = error.message;
            
            if (error.message.includes('413') || error.message.includes('PayloadTooLargeError')) {
                errorMessage = `File quá lớn để tải lên server. Vui lòng chọn file nhỏ hơn 100MB. File hiện tại: ${formatFileSize(uploadForm.file.size)}`;
            } else if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Upload quá lâu. Vui lòng thử lại với file nhỏ hơn';
            }
            
            alert(`Có lỗi xảy ra khi tải file lên: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

// ...existing code...

    // Handle close
    const handleClose = () => {
        if (!uploading) {
            setActiveStep(0);
            setUploadForm({
                title: '',
                description: '',
                type: 'lecture',
                category: '',
                status: 'active',
                allowDownload: true,
                tags: [],
                authors: [],
                file: null,
                courseId: courseId,
                classId: classId
            });
            setErrors({});
            onClose();
        }
    };

    // Step content - Step 0: File Selection
    const renderFileSelectionStep = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Chọn tài liệu để tải lên
            </Typography>
            
            {/* File size warning */}
            <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Lưu ý:</strong> Kích thước file tối đa là <strong>50MB</strong>. 
                    Nếu file lớn hơn, vui lòng nén hoặc chia nhỏ file trước khi tải lên.
                </Typography>
            </Alert>
            
            {/* Upload Area */}
            <Card 
                sx={{ 
                    mb: 3, 
                    border: '2px dashed', 
                    borderColor: errors.file ? 'error.main' : 'grey.300',
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
                        Click để chọn file tài liệu
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, MP4, ZIP, RAR
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Kích thước tối đa: 50MB • Chỉ chọn 1 file
                    </Typography>
                </CardContent>
            </Card>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.zip,.rar,.jpg,.jpeg,.png,.gif"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />

            {errors.file && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        {errors.file}
                    </Typography>
                </Alert>
            )}

            {/* Selected File Display */}
            {uploadForm.file && (
                <Card>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <CheckIcon color="success" sx={{ mr: 1 }} />
                            File đã chọn
                        </Typography>
                        <ListItem 
                            sx={{ 
                                border: '1px solid', 
                                borderColor: 'success.main', 
                                borderRadius: 1,
                                bgcolor: 'success.50'
                            }}
                        >
                            <ListItemIcon>
                                {getFileIcon(uploadForm.file)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {uploadForm.file.name}
                                    </Typography>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Kích thước: {formatFileSize(uploadForm.file.size)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Loại: {uploadForm.file.type || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    onClick={handleRemoveFile}
                                    color="error"
                                    title="Xóa file"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </CardContent>
                </Card>
            )}
        </Box>
    );

    // Step content
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return renderFileSelectionStep();

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
                                    value={uploadForm.authors}
                                    onChange={(event, newValue) => {
                                        setUploadForm(prev => ({ ...prev, authors: newValue }));
                                        if (errors.authors) {
                                            setErrors(prev => ({ ...prev, authors: '' }));
                                        }
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
                                            placeholder={uploadForm.authors.length === 0 ? "Ví dụ: Nguyễn Văn A" : "Thêm tác giả khác..."}
                                            error={!!errors.authors}
                                            helperText={errors.authors || "Nhấn Enter sau khi nhập tên để thêm tác giả"}
                                        />
                                    )}
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
                                    value={uploadForm.tags}
                                    onChange={(event, newValue) => {
                                        setUploadForm(prev => ({ ...prev, tags: newValue }));
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
                                            placeholder={uploadForm.tags.length === 0 ? "Ví dụ: Java, Programming, Exercise" : "Thêm tag khác..."}
                                            helperText="Có thể chọn từ gợi ý hoặc nhập tag mới, nhấn Enter để thêm"
                                        />
                                    )}
                                />
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
                                                    checked={uploadForm.status === 'active'}
                                                    onChange={(e) => setUploadForm(prev => ({ 
                                                        ...prev, 
                                                        status: e.target.checked ? 'active' : 'draft'
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

                                        {/* Authors */}
                                        {uploadForm.authors.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Tác giả ({uploadForm.authors.length})
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {uploadForm.authors.map((author, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={author}
                                                            size="small"
                                                            variant="outlined"
                                                            icon={<PeopleIcon />}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Tags */}
                                        {uploadForm.tags.length > 0 && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Tags ({uploadForm.tags.length})
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {uploadForm.tags.map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tag}
                                                            size="small"
                                                            color="primary"
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
                                            File và cài đặt
                                        </Typography>
                                        
                                        {/* File info */}
                                        {uploadForm.file && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    File tài liệu
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}>
                                                    {getFileIcon(uploadForm.file)}
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {uploadForm.file.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatFileSize(uploadForm.file.size)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 2 }} />

                                        {/* Settings */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Cài đặt
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                {uploadForm.status === 'active' ? (
                                                    <CheckIcon color="success" sx={{ mr: 1 }} />
                                                ) : (
                                                    <ErrorIcon color="warning" sx={{ mr: 1 }} />
                                                )}
                                                <Typography variant="body2">
                                                    {uploadForm.status === 'active' ? 'Xuất bản ngay' : 'Lưu dưới dạng bản nháp'}
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

                                        <Divider sx={{ my: 2 }} />

                                        {/* Upload destination */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Điểm đến
                                            </Typography>
                                            <Typography variant="body2">
                                                {classId ? `Lớp học (ID: ${classId})` : `Môn học (ID: ${courseId})`}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {classId ? 'Tài liệu sẽ chỉ hiển thị trong lớp học này' : 'Tài liệu sẽ hiển thị trong toàn bộ môn học'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Final review */}
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                <strong>Kiểm tra cuối cùng:</strong> Hãy đảm bảo tất cả thông tin đã chính xác trước khi tải lên. 
                                Bạn có thể chỉnh sửa thông tin sau khi upload thành công.
                            </Typography>
                        </Alert>
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
                                Đang tải lên... {Math.round(uploadProgress)}%
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