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
    Pagination
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
    FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../../configs/system";
import { useAuth } from '../../../contexts/AuthContext';

const CourseNotificationsPage = () => {
    const { authenticatedFetch } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;
    const className = params.courseName;

    const [notifications, setNotifications] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Thêm state cho pagination
    const [notificationPagination, setNotificationPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        pages: 0
    });

    // Fetch course data và notifications với pagination
    // useEffect(() => {
    //     const fetchCourseData = async () => {
    //         try {
    //             setLoading(true);
    //             // Fetch course info
    //             const courseResponse = await authenticatedFetch(`${API_BASE_URL}/student/courses/${courseId}`);
    //             if (!courseResponse.ok) {
    //                 throw new Error("Failed to fetch course data");
    //             }
    //             const courseData = await courseResponse.json();
    //             console.log(courseData.data.course);
    //             setCourse(courseData.data.course);

    //             // Fetch notifications for this course với pagination
    //             await fetchNotifications(1); // Load page 1 mặc định

    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //             setError(error.message || "Có lỗi xảy ra khi tải dữ liệu");
    //             setLoading(false);
    //         }
    //     };

    //     if (courseId) {
    //         fetchCourseData();
    //     }
    // }, [courseId, authenticatedFetch])

    // Fetch notifications với pagination
    const fetchNotifications = async (page = 1, limit = 5) => {
                try {
                    setLoading(true);
                    let api = `${API_BASE_URL}/student/notifications`;
                    if (courseId) api += `/${courseId}`;
                    console.log(api);
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
            // Scroll to top khi chuyển trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
                return <PriorityHighIcon sx={{ color: '#d32f2f' }} />;
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

    // Truncate content for preview
    const truncateContent = (content, maxLength = 150) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setModalOpen(true);
        setIsFullscreen(false);

        // Mark notification as read if it has an API endpoint
        markAsRead(notification._id);
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/student/notifications/${notificationId}/read`, {
                method: 'PUT'
            });

            if (response.ok) {
                // Update local state
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

    // Handle modal close
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNotification(null);
        setIsFullscreen(false);
    };

    // Toggle fullscreen
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
                    border: `1px solid ${priorityStyle.borderColor}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        transform: 'translateY(-3px)',
                        borderColor: '#d32f2f'
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
                    >
                        {truncateContent(notification.content)}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 2,
                                    bgcolor: '#d32f2f',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            >
                                {notification.author?.name?.charAt(0).toUpperCase() ||
                                    notification.authorName?.charAt(0).toUpperCase() || 'G'}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                                    {notification.author?.name || notification.authorName || 'Giảng viên'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, color: '#666' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatTimeAgo(notification.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Button
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                '&:hover': {
                                    borderColor: '#b71c1c',
                                    bgcolor: '#ffebee'
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                            }}
                        >
                            Xem chi tiết
                        </Button>
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
                                bgcolor: '#d32f2f',
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}
                        >
                            {selectedNotification.author?.name?.charAt(0).toUpperCase() ||
                                selectedNotification.authorName?.charAt(0).toUpperCase() || 'G'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                                {selectedNotification.author?.name || selectedNotification.authorName || 'Giảng viên'}
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
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: '#333',
                            fontSize: '1.1rem',
                            whiteSpace: 'pre-line',
                            textAlign: 'justify'
                        }}
                    >
                        {selectedNotification.content}
                    </Typography>
                </DialogContent>

                <DialogActions sx={{
                    p: 3,
                    pt: 1,
                    bgcolor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Môn học: {className}
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
                            onClick={handleCloseModal}
                            variant="contained"
                            sx={{
                                bgcolor: '#d32f2f',
                                '&:hover': { bgcolor: '#b71c1c' }
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    color="inherit"
                    onClick={() => navigate('/student')}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <Home sx={{ mr: 0.5, fontSize: 16 }} />
                    Trang chủ
                </Link>
                <Link
                    color="inherit"
                    onClick={() => navigate('/courses')}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <School sx={{ mr: 0.5, fontSize: 16 }} />
                    Môn học
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsIcon sx={{ mr: 0.5, fontSize: 16 }} />
                    Thông báo
                </Typography>
            </Breadcrumbs>

            {/* Header Section */}
            {courseId &&
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderLeft: '4px solid #d32f2f',
                        borderRadius: '8px',
                        mb: 4
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                                    Thông báo môn học
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {className || 'Đang tải...'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Tổng cộng: <strong>{notificationPagination.total}</strong> thông báo
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                '&:hover': {
                                    borderColor: '#b71c1c',
                                    bgcolor: '#ffebee'
                                }
                            }}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </Paper>
            }

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

                        {/* Hiển thị thông tin phân trang */}
                        {/* {notificationPagination.total > 0 && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Hiển thị {((notificationPagination.page - 1) * notificationPagination.limit) + 1} - {Math.min(notificationPagination.page * notificationPagination.limit, notificationPagination.total)} 
                                    {' '}trong tổng số {notificationPagination.total} thông báo
                                </Typography>
                            </Box>
                        )} */}
                    </>
                )}
            </Box>

            {/* Notification Detail Modal */}
            <NotificationModal />

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