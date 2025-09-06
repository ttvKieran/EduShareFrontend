import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Grid,
    Container,
    Paper,
    Avatar,
    Divider,
    IconButton,
    Alert,
    Breadcrumbs,
    Link,
    CircularProgress,
    Stack,
    Badge,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Snackbar
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    PriorityHigh as PriorityHighIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    ArrowBack as ArrowBackIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    School,
    Home,
    Class as ClassIcon,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Delete as DeleteIcon,
    DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../../configs/system";
import { useAuth } from '../../../contexts/AuthContext';

const CourseNotificationsPage = ({ classId }) => {
    const { authenticatedFetch } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;

    const [notifications, setNotifications] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Thêm state cho delete confirmation
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Thêm state cho snackbar thông báo
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // State cho pagination
    const [notificationPagination, setNotificationPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        pages: 0
    });

    // Fetch notifications với pagination
    const fetchNotifications = async (page = 1, limit = 5) => {
        try {
            setLoading(true);
            let api = `${API_BASE_URL}/lecturer/notifications`;
            if (courseId) api += `/course/${courseId}`;
            else if (classId) api += `/class/${classId}`;
            console.log("api: ", api);
            const response = await authenticatedFetch(
                `${api}?page=${page}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const result = await response.json();
            console.log(result.data.notifications);
            if (result.success) {
                setNotifications(result.data.notifications);
                setNotificationPagination(result.data.pagination);
            } else {
                throw new Error(result.message || "Failed to load notifications");
            }

        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError(error.message || "Có lỗi xảy ra khi tải thông báo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [courseId, authenticatedFetch])

    // Handle pagination change
    const handleNotificationPageChange = (event, value) => {
        if (value !== notificationPagination.page) {
            fetchNotifications(value, notificationPagination.limit);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle delete notification
    const handleDeleteClick = (notification, event) => {
        event.stopPropagation(); // Ngăn trigger click vào card
        setDeletingNotification(notification);
        setDeleteConfirmOpen(true);
    };

    // Confirm delete notification
    const confirmDeleteNotification = async () => {
        if (!deletingNotification) return;

        try {
            setDeleteLoading(true);
            const response = await authenticatedFetch(
                `${API_BASE_URL}/lecturer/notifications/${deletingNotification._id}`,
                {
                    method: 'DELETE'
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Remove notification from local state
                    setNotifications(prev => 
                        prev.filter(n => n._id !== deletingNotification._id)
                    );
                    
                    // Update pagination if needed
                    setNotificationPagination(prev => ({
                        ...prev,
                        total: prev.total - 1
                    }));

                    // Show success message
                    setSnackbar({
                        open: true,
                        message: 'Thông báo đã được gỡ thành công',
                        severity: 'success'
                    });

                    // Close modal if this notification is being viewed
                    if (selectedNotification?._id === deletingNotification._id) {
                        handleCloseModal();
                    }

                    // Refresh list if current page is empty
                    if (notifications.length === 1 && notificationPagination.page > 1) {
                        fetchNotifications(notificationPagination.page - 1);
                    }
                } else {
                    throw new Error(result.message || 'Không thể gỡ thông báo');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Có lỗi xảy ra khi gỡ thông báo');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Có lỗi xảy ra khi gỡ thông báo',
                severity: 'error'
            });
        } finally {
            setDeleteLoading(false);
            setDeleteConfirmOpen(false);
            setDeletingNotification(null);
        }
    };

    // Handle snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'Vừa xong';
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        if (diffInDays < 7) return `${diffInDays} ngày trước`;

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'cao':
                return <PriorityHighIcon sx={{ color: '#42A5F5' }} />;
            case 'medium':
            case 'trung bình':
            case 'trung binh':
                return <WarningIcon sx={{ color: '#ed6c02' }} />;
            case 'low':
            case 'thấp':
            case 'thap':
                return <InfoIcon sx={{ color: '#1976d2' }} />;
            default:
                return <InfoIcon sx={{ color: '#666' }} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'cao':
                return { bgcolor: '#ffebee', color: '#d32f2f', borderColor: '#d32f2f' };
            case 'medium':
            case 'trung bình':
            case 'trung binh':
                return { bgcolor: '#fff3e0', color: '#ed6c02', borderColor: '#ed6c02' };
            case 'low':
            case 'thấp':
            case 'thap':
                return { bgcolor: '#e3f2fd', color: '#1976d2', borderColor: '#1976d2' };
            default:
                return { bgcolor: '#f5f5f5', color: '#666', borderColor: '#666' };
        }
    };

    const truncateContent = (content, maxLength = 150) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setModalOpen(true);
        setIsFullscreen(false);
        markAsRead(notification._id);
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/student/notifications/${notificationId}/read`, {
                method: 'PUT'
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n =>
                        n._id === notificationId
                            ? { ...n, isRead: true, isNew: false }
                            : n
                    )
                );
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNotification(null);
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const NotificationCard = ({ notification }) => {
        const priorityStyle = getPriorityColor(notification.priority);

        return (
            <Card
                elevation={2}
                sx={{
                    mb: 3,
                    borderRadius: '8px',
                    border: `1px solid #42A5F5`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        transform: 'translateY(-3px)',
                        borderColor: '#42A5F5'
                    }
                }}
                onClick={() => handleNotificationClick(notification)}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            {getPriorityIcon(notification.priority)}
                            <Typography
                                variant="h6"
                                sx={{
                                    ml: 2,
                                    fontWeight: 600,
                                    color: '#333',
                                    flex: 1
                                }}
                            >
                                {notification.title}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                                label={notification.priority || 'Thông thường'}
                                size="small"
                                sx={{
                                    ...priorityStyle,
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}
                            />
                            {notification.isNew && (
                                <Chip
                                    label="Mới"
                                    size="small"
                                    sx={{
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        animation: 'pulse 2s infinite'
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Preview content */}
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 2,
                            lineHeight: 1.6,
                            color: '#666',
                            fontStyle: 'italic'
                        }}
                        dangerouslySetInnerHTML={{ __html: truncateContent(notification.content) }}
                    >
                        {/* {truncateContent(notification.content)} */}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 2,
                                    bgcolor: '#42A5F5',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            >
                                {notification.author?.authorId?.fullName?.charAt(0).toUpperCase() ||
                                    notification.authorName?.charAt(0).toUpperCase() || 'G'}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                                    {notification.author?.authorId?.fullName || notification.authorName || 'Giảng viên'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, color: '#666' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatTimeAgo(notification.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: '#42A5F5',
                                    color: '#42A5F5',
                                    '&:hover': {
                                        borderColor: '#42A5F5',
                                        bgcolor: '#e3f2fd'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationClick(notification);
                                }}
                            >
                                Xem chi tiết
                            </Button>
                            
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                sx={{
                                    borderColor: '#d32f2f',
                                    color: '#d32f2f',
                                    '&:hover': {
                                        borderColor: '#b71c1c',
                                        bgcolor: '#ffebee'
                                    }
                                }}
                                onClick={(e) => handleDeleteClick(notification, e)}
                            >
                                Gỡ
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Notification Detail Modal
    const NotificationModal = () => {
        if (!selectedNotification) return null;

        const priorityStyle = getPriorityColor(selectedNotification.priority);

        return (
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth={false}
                fullScreen={isFullscreen}
                sx={{
                    '& .MuiDialog-paper': {
                        width: isFullscreen ? '100%' : '90%',
                        maxWidth: isFullscreen ? '100%' : '800px',
                        height: isFullscreen ? '100%' : 'auto',
                        maxHeight: isFullscreen ? '100%' : '90vh',
                        borderRadius: isFullscreen ? 0 : '12px'
                    }
                }}
            >
                <DialogTitle sx={{
                    p: 3,
                    pb: 1,
                    bgcolor: '#f8f9fa',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
                            {getPriorityIcon(selectedNotification.priority)}
                            <Typography
                                variant="h5"
                                sx={{
                                    ml: 2,
                                    fontWeight: 600,
                                    color: '#333',
                                    flex: 1
                                }}
                            >
                                {selectedNotification.title}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                                label={selectedNotification.priority || 'Thông thường'}
                                size="small"
                                sx={{
                                    ...priorityStyle,
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                }}
                            />
                            {selectedNotification.isNew && (
                                <Chip
                                    label="Mới"
                                    size="small"
                                    sx={{
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            )}

                            <IconButton
                                onClick={toggleFullscreen}
                                sx={{ color: '#666' }}
                                title={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
                            >
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>

                            <IconButton
                                onClick={handleCloseModal}
                                sx={{ color: '#666' }}
                                title="Đóng"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Author info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                bgcolor: '#42A5F5',
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}
                        >
                            {selectedNotification.author?.authorId?.fullName?.charAt(0).toUpperCase() ||
                                selectedNotification.authorName?.charAt(0).toUpperCase() || 'G'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                                {selectedNotification.author?.authorId?.fullName || selectedNotification.authorName || 'Giảng viên'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatTimeAgo(selectedNotification.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 4 }}>
                    <Box 
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: '#333',
                            fontSize: '1.1rem',
                            whiteSpace: 'pre-line',
                            textAlign: 'justify'
                        }}
                        dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
                    >
                        {/* {selectedNotification.content} */}
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 3,
                    pt: 1,
                    bgcolor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Môn học:
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={toggleFullscreen}
                            startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            sx={{ color: '#666' }}
                        >
                            {isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
                        </Button>
                        
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(selectedNotification, e);
                            }}
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteOutlineIcon />}
                        >
                            Gỡ thông báo
                        </Button>
                        
                        <Button
                            onClick={handleCloseModal}
                            variant="contained"
                            sx={{
                                bgcolor: '#42A5F5',
                                '&:hover': { bgcolor: '#42A5F5' }
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Container sx={{}}>
            {/* Content Section */}
            <Box>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress sx={{ mr: 2 }} />
                        <Typography>Đang tải thông báo...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                        <Button
                            onClick={() => fetchNotifications(notificationPagination.page)}
                            size="small"
                            sx={{ ml: 2 }}
                        >
                            Thử lại
                        </Button>
                    </Alert>
                )}

                {!loading && !error && notifications.length === 0 && (
                    <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: '8px' }}>
                        <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            Chưa có thông báo nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Hiện tại môn học này chưa có thông báo nào. Vui lòng kiểm tra lại sau.
                        </Typography>
                    </Paper>
                )}

                {!loading && !error && notifications.length > 0 && (
                    <>
                        <Stack spacing={0}>
                            {notifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                />
                            ))}
                        </Stack>

                        {/* Pagination */}
                        {notificationPagination.pages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={notificationPagination.pages}
                                    page={notificationPagination.page}
                                    onChange={handleNotificationPageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                    disabled={loading}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>

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
                    <DeleteIcon sx={{ color: 'error.main', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Xác nhận gỡ thông báo
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 3, fontSize: '1rem' }}>
                        Bạn có chắc chắn muốn gỡ thông báo này không?
                    </Typography>
                    
                    {deletingNotification && (
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: '#f8f9fa', 
                            borderRadius: 2,
                            border: '1px solid #e0e0e0'
                        }}>
                            <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                mb: 1,
                                color: '#333'
                            }}>
                                {deletingNotification.title}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                {truncateContent(deletingNotification.content, 100)}
                            </Typography> */}
                        </Box>
                    )}
                    
                    <Alert severity="warning" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Thông báo sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
                        onClick={confirmDeleteNotification}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
                        sx={{ 
                            minWidth: '120px',
                            '&:disabled': {
                                opacity: 0.7
                            }
                        }}
                    >
                        {deleteLoading ? 'Đang gỡ...' : 'Gỡ thông báo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Detail Modal */}
            <NotificationModal />

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

            {/* CSS for pulse animation */}
            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.7; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        </Container>
    );
};

export default CourseNotificationsPage;