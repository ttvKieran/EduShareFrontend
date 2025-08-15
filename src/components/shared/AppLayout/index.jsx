import React, { useState, useEffect } from 'react';
import API_BASE_URL from "../../../configs/system";
import './style.css';
import {
    AppBar,
    Toolbar,
    Typography,
    Pagination,
    Button,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    Badge,
    InputBase,
    Tooltip,
    ListItemButton,
    Collapse,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Computer as SystemIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    Home,
    School,
    Assignment,
    Person,
    Settings,
    Notifications,
    AccountCircle,
    History,
    Bookmark,
    Download,
    MenuBook,
    Quiz,
    Folder,
    Help,
    ExpandLess,
    ExpandMore,
    Subject,
    Category,
    CloudDownload,
    BookmarkBorder,
    Star,
    TrendingUp,
    Schedule,
    LibraryBooks,
    PlaylistAddCheck,
    FilterList,
    ChevronLeft,
    ChevronRight,
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    AccessTime as AccessTimeIcon,
    PriorityHigh as PriorityHighIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    // System as SystemIcon,
    Book as BookIcon
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from '../../../contexts/AuthContext';

import { styled, alpha } from '@mui/material/styles';

// Styled components cho search box
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.08),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));

// Styled component cho toggle button
const ToggleButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    left: 25,
    zIndex: theme.zIndex.drawer + 2,
    backgroundColor: '#F44336',
    color: 'white',
    '&:hover': {
        backgroundColor: '#D32F2F',
        transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
}));

const MiniToggleButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    left: 13,
    zIndex: theme.zIndex.drawer + 2,
    backgroundColor: '#F44336',
    color: 'white',
    size: 'small',
    '&:hover': {
        backgroundColor: '#D32F2F',
        transform: 'scale(1.1)',
    },
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
}));

const drawerWidth = 240;
const miniDrawerWidth = 70;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        marginTop: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
        },
    },
}));

const StyledMiniDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: miniDrawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
        marginTop: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        '&::-webkit-scrollbar': {
            width: '4px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#ddd',
            borderRadius: '2px',
        },
    },
}));

const StudentCourseSelection = () => {
    const [searchValue, setSearchValue] = useState('');
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [quickAccessAnchorEl, setQuickAccessAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { authenticatedFetch } = useAuth();

    // Thêm state cho notification modal
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const navigate = useNavigate();

    // Mock data cho thông báo trong topbar
    const mockNotifications = [
        {
            _id: "1",
            title: "Bảo trì hệ thống định kỳ",
            content: "Hệ thống sẽ được bảo trì vào 20:00-22:00 ngày 10/8/2025. Trong thời gian này, các tính năng tải tài liệu và đăng nhập có thể bị gián đoạn. Vui lòng hoàn thành các tác vụ trước thời gian bảo trì.\n\nCác dịch vụ bị ảnh hưởng:\n- Đăng nhập/đăng xuất\n- Tải tài liệu\n- Upload file\n- Tìm kiếm nâng cao\n\nHệ thống sẽ hoạt động trở lại bình thường sau 22:00. Xin lỗi vì sự bất tiện này.",
            type: "system",
            priority: "cao",
            author: "Quản trị hệ thống",
            createdAt: "2025-08-09T09:00:00Z",
            isNew: true,
            isRead: false
        },
        {
            _id: "2",
            title: "Tài liệu mới: Giáo trình Java cơ bản",
            content: "Đã có tài liệu mới được cập nhật cho môn Lập trình hướng đối tượng. Tài liệu bao gồm:\n\n1. Cú pháp Java cơ bản\n2. OOP concepts (Đóng gói, Kế thừa, Đa hình)\n3. Exception handling\n4. Collections Framework\n5. File I/O\n6. Multithreading cơ bản\n\nCác bạn có thể tải về từ thư mục tài liệu của môn học. Tài liệu được biên soạn bởi team giảng viên với nội dung cập nhật theo chương trình mới nhất.",
            type: "document",
            priority: "trung bình",
            author: "TS. Nguyễn Thị Lan",
            courseId: "6678abc123def456",
            courseName: "Lập trình hướng đối tượng",
            createdAt: "2025-08-08T14:30:00Z",
            isNew: true,
            isRead: false
        },
        {
            _id: "3",
            title: "Nhắc nhở: Hạn nộp bài tập sắp đến",
            content: "Còn 3 ngày nữa đến hạn nộp bài tập lớn môn Cơ sở dữ liệu. \n\nYêu cầu bài tập:\n- Thiết kế CSDL cho hệ thống quản lý thư viện\n- Viết stored procedure cho các chức năng cơ bản\n- Tạo trigger để đảm bảo tính toàn vẹn dữ liệu\n- Viết báo cáo chi tiết quá trình thiết kế\n\nHình thức nộp:\n- File SQL (.sql)\n- Báo cáo Word (.docx)\n- Nộp qua email: pgstran@hust.edu.vn\n\nHạn cuối: 23h59 ngày 12/8/2025",
            type: "assignment",
            priority: "cao",
            author: "PGS. Trần Văn Minh",
            courseId: "6678abc123def457",
            courseName: "Cơ sở dữ liệu",
            createdAt: "2025-08-07T10:00:00Z",
            isNew: false,
            isRead: false
        }
    ];

    const fetchNotifications = async (page = 1, limit = 5) => {
                try {
                    setLoading(true);
                    let api = `${API_BASE_URL}/student/notifications`;
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
                    } else {
                        throw new Error(result.message || "Failed to load notifications");
                    }

                } catch (error) {
                    console.error("Error fetching notifications:", error);
                } finally {
                    setLoading(false);
                }
            };
    useEffect(() => {
        fetchNotifications();
    }, [authenticatedFetch]);

    // Mock data cho sinh viên
    const studentInfo = {
        name: "Nguyễn Văn A",
        studentId: "B22DCCN999",
        semester: "Kỳ 1 - 2024/2025",
        downloadCount: 12
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    // Thêm handler cho notification modal
    const handleNotificationItemClick = (notification) => {
        setSelectedNotification(notification);
        setModalOpen(true);
        setNotificationAnchorEl(null);
        setIsFullscreen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNotification(null);
        setIsFullscreen(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleViewAllNotifications = () => {
        setNotificationAnchorEl(null);
        navigate('/notifications');
    };

    // Thêm helper functions cho notification
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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'system':
                return <BookIcon sx={{ color: '#f44336' }} />;
            case 'document':
                return <BookIcon sx={{ color: '#2196f3' }} />;
            case 'assignment':
                return <Assignment sx={{ color: '#ff9800' }} />;
            case 'schedule':
                return <Schedule sx={{ color: '#4caf50' }} />;
            default:
                return <InfoIcon sx={{ color: '#666' }} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'system':
                return { bgcolor: '#ffebee', color: '#f44336', borderColor: '#f44336' };
            case 'document':
                return { bgcolor: '#e3f2fd', color: '#2196f3', borderColor: '#2196f3' };
            case 'assignment':
                return { bgcolor: '#fff3e0', color: '#ff9800', borderColor: '#ff9800' };
            case 'schedule':
                return { bgcolor: '#e8f5e8', color: '#4caf50', borderColor: '#4caf50' };
            default:
                return { bgcolor: '#f5f5f5', color: '#666', borderColor: '#666' };
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'system':
                return 'Hệ thống';
            case 'document':
                return 'Tài liệu';
            case 'assignment':
                return 'Bài tập';
            case 'schedule':
                return 'Lịch học';
            default:
                return 'Khác';
        }
    };

    // Notification Detail Modal Component
    const NotificationModal = () => {
        if (!selectedNotification) return null;

        const typeStyle = getTypeColor(selectedNotification.type);

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
                            {getTypeIcon(selectedNotification.type)}
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
                                label={getTypeLabel(selectedNotification.type)}
                                size="small"
                                sx={{
                                    ...typeStyle,
                                    fontWeight: 600,
                                    fontSize: '0.8rem'
                                }}
                            />
                            {selectedNotification.courseName && (
                                <Chip
                                    icon={<School />}
                                    label={selectedNotification.courseName}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                        fontSize: '0.8rem',
                                        borderColor: '#2196f3',
                                        color: '#2196f3'
                                    }}
                                />
                            )}
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
                            {selectedNotification.author?.name?.charAt(0).toUpperCase() || 'H'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                                {selectedNotification.author.name || 'Hệ thống'}
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
                        Loại: {getTypeLabel(selectedNotification.type)}
                        {selectedNotification.courseName && ` • Môn: ${selectedNotification.courseName}`}
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

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleQuickAccessClick = (event) => {
        setQuickAccessAnchorEl(event.currentTarget);
    };

    const handleClose = async () => {
        setNotificationAnchorEl(null);
        setProfileAnchorEl(null);
        setQuickAccessAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Tìm kiếm:', searchValue);
    };

    // const handleLogout = async () => {
    //     setProfileAnchorEl(null);
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/user/logout`, {
    //             method: "POST",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //             },
    //             data: {id: currentUser._id}
    //         });
    //         if (!response.ok) {
    //             throw new Error("Đăng xuất thất bại");
    //         } else {
    //             sessionStorage.removeItem("token");
    //             sessionStorage.removeItem("currentUser");
    //             setCurrentUser(null);
    //             toast.success("Đăng xuất thành công");
    //             navigate(`/login`);
    //         }
    //     } catch (error) {
    //         console.log("Lỗi", error);
    //         toast.error("Đăng xuất thất bại");
    //     }
    // }
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        setProfileAnchorEl(null);
        try {
            await logout();
            toast.success("Đăng xuất thành công");
            navigate("/login");
        } catch (error) {
            toast.error("Đăng xuất thất bại");
        }
    };

    const [openSubjects, setOpenSubjects] = useState(false);
    const [openDocuments, setOpenDocuments] = useState(false);
    const [openPersonal, setOpenPersonal] = useState(false);
    const [selectedItem, setSelectedItem] = useState('dashboard');

    const studentStats = {
        totalDownloads: 2,
        bookmarkedDocs: 8,
        recentViews: 5,
        monthlyLimit: 20
    };

    const currentSubjects = [
        { id: 1, name: 'Lập trình hướng đối tượng', code: 'IT101', newDocs: 3 },
        { id: 2, name: 'Cơ sở dữ liệu', code: 'IT102', newDocs: 1 },
        { id: 3, name: 'Mạng máy tính', code: 'IT103', newDocs: 0 },
        { id: 4, name: 'Toán rời rạc', code: 'MT201', newDocs: 2 },
        { id: 5, name: 'Tiếng Anh chuyên ngành', code: 'EN301', newDocs: 0 }
    ];

    const documentCategories = [
        { name: 'Giáo trình', count: 45, icon: <LibraryBooks />, path: 'curriculum' },
        { name: 'Bài giảng', count: 28, icon: <Subject />, path: 'lecture' },
        { name: 'Đề thi', count: 15, icon: <Quiz />, path: 'exam' },
        { name: 'Bài tập', count: 32, icon: <Assignment />, path: 'exercise' },
        { name: 'Tài liệu tham khảo', count: 67, icon: <MenuBook />, path: 'reference' }
    ];

    const handleClick = (item) => {
        setSelectedItem(item);

        const documentPaths = ['curriculum', 'lecture', 'exam', 'exercise', 'reference'];
        if (documentPaths.includes(item)) {
            setOpenDocuments(true);
        }

        navigate(`/${item}`);
    };

    const handleSubjectsClick = () => {
        setOpenSubjects(!openSubjects);
    };

    const handleDocumentsClick = () => {
        setOpenDocuments(!openDocuments);
    };

    const handlePersonalClick = () => {
        setOpenPersonal(!openPersonal);
    };

    const NavItem = ({ item, icon, text, onClick, badge = null, chip = null, mini = false }) => (
        <ListItem disablePadding>
            <Tooltip title={mini ? text : ""} placement="right" arrow>
                <ListItemButton
                    selected={selectedItem === item}
                    onClick={() => onClick(item)}
                    sx={{
                        borderRadius: 1,
                        mx: mini ? 0.5 : 1,
                        my: 0.5,
                        minHeight: 48,
                        justifyContent: mini ? 'center' : 'initial',
                        px: mini ? 1.5 : 2,
                        '&.Mui-selected': {
                            backgroundColor: '#fff3e0',
                            color: '#F44336',
                            '&:hover': {
                                backgroundColor: '#fff3e0',
                            },
                        },
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                            transform: 'translateX(2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <ListItemIcon sx={{
                        minWidth: mini ? 0 : 40,
                        mr: mini ? 0 : 1,
                        color: selectedItem === item ? '#F44336' : 'inherit',
                        justifyContent: 'center'
                    }}>
                        {badge ? (
                            <Badge badgeContent={badge} color="error">
                                {icon}
                            </Badge>
                        ) : (
                            icon
                        )}
                    </ListItemIcon>
                    {!mini && (
                        <ListItemText
                            primary={text}
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                    )}
                    {!mini && chip && (
                        <Chip
                            label={chip}
                            size="small"
                            color="primary"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                    )}
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Floating Toggle Button */}
            {drawerOpen ? (
                <ToggleButton
                    onClick={handleDrawerToggle}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <ChevronLeft />
                </ToggleButton>
            ) : (
                <MiniToggleButton
                    onClick={handleDrawerToggle}
                    size="small"
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <ChevronRight />
                </MiniToggleButton>
            )}

            {/* Desktop Sidebar */}
            {drawerOpen ? (
                <StyledDrawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRight: '0px solid #e0e0e0',
                            boxShadow: 2,
                            borderRadius: 0,
                            marginTop: 0,
                            height: '100vh',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'white #f9f9f9',
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f9f9f9',
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ddd',
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#ccc',
                            },
                        },
                    }}
                >
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            component="img"
                            sx={{
                                height: 48,
                                width: 216,
                                maxHeight: { xs: 233, md: 167 },
                                maxWidth: { xs: 350, md: 250 },
                                transition: 'all 0.3s ease-in-out',
                            }}
                            alt="Logo"
                            src="/logoBig.png"
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <List>
                            <NavItem
                                item=""
                                icon={<Home />}
                                text="Trang chủ"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="courses"
                                icon={<School />}
                                text="Môn học"
                                onClick={handleClick}
                                mini={false}
                            />

                            <Divider sx={{ my: 1 }} />

                            <ListItem disablePadding>
                                <ListItemButton onClick={handleDocumentsClick} sx={{ borderRadius: 1, mx: 1, my: 0.5, transition: 'all 0.2s ease-in-out', '&:hover': { backgroundColor: '#f5f5f5', transform: 'translateX(2px)' } }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Folder />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Tài liệu"
                                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    />
                                    {openDocuments ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>

                            <Collapse in={openDocuments} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {documentCategories.map((category, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton
                                                selected={selectedItem === category.path}
                                                sx={{
                                                    pl: 6,
                                                    borderRadius: 1,
                                                    mx: 1,
                                                    my: 0.25,
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#fff3e0',
                                                        color: '#F44336',
                                                        '&:hover': {
                                                            backgroundColor: '#fff3e0',
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                                onClick={() => handleClick(`${category.path}`)}
                                            >
                                                <ListItemIcon sx={{
                                                    minWidth: 35,
                                                    color: selectedItem === category.path ? '#F44336' : 'inherit'
                                                }}>
                                                    {category.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={category.name}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: selectedItem === category.path ? 600 : 400
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>

                            {/* <Divider sx={{ my: 1 }} />

                            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.7rem' }}>
                                Truy cập nhanh
                            </Typography>

                            <NavItem
                                item="downloads"
                                icon={<CloudDownload />}
                                text="Tải xuống"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="bookmarks"
                                icon={<BookmarkBorder />}
                                text="Đã bookmark"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="history"
                                icon={<History />}
                                text="Lịch sử xem"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="favorites"
                                icon={<Star />}
                                text="Yêu thích"
                                onClick={handleClick}
                                mini={false}
                            /> */}

                            <Divider sx={{ my: 1 }} />

                            <NavItem
                                item="profile"
                                icon={<Person />}
                                text="Thông tin cá nhân"
                                onClick={handleClick}
                                mini={false}
                            />

                            <NavItem
                                item="help"
                                icon={<Help />}
                                text="Trợ giúp"
                                onClick={handleClick}
                                mini={false}
                            />
                        </List>
                    </Box>
                </StyledDrawer>
            ) : (
                <StyledMiniDrawer
                    variant="permanent"
                    sx={{
                        width: miniDrawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: miniDrawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            borderRight: '0px solid #e0e0e0',
                            boxShadow: 2,
                            borderRadius: 0,
                            marginTop: 0,
                            height: '100vh',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        },
                    }}
                >
                    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            sx={{
                                height: 40,
                                width: 40,
                                marginBottom: '8px',
                                transition: 'all 0.3s ease-in-out',
                            }}
                            alt="Logo Mini"
                            src='/logo.png'
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <List>
                            <NavItem
                                item=""
                                icon={<Home />}
                                text="Trang chủ"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="courses"
                                icon={<School />}
                                text="Môn học"
                                onClick={handleClick}
                                mini={true}
                            />

                            {/* <Divider sx={{ my: 1 }} /> */}

                            
                            <Divider sx={{ my: 1 }} />
                            {documentCategories.map((category, index) => (
                                <Box sx={{
                                        color: selectedItem === category.path ? '#F44336' : 'inherit'
                                    }}>
                                    <NavItem
                                    // item="downloads"
                                    icon={category.icon}
                                    text={category.name}
                                    onClick={() => handleClick(`${category.path}`)}
                                    mini={true}
                                    key={index}
                                    selected={selectedItem === category.path}
                                    
                                />
                                </Box>
                                // <ListItem key={index} disablePadding>
                                //     <ListItemButton
                                //         selected={selectedItem === category.path}
                                //         sx={{
                                //             pl: 6,
                                //             borderRadius: 1,
                                //             mx: 1,
                                //             my: 0.25,
                                //             transition: 'all 0.2s ease-in-out',
                                //             '&.Mui-selected': {
                                //                 backgroundColor: '#fff3e0',
                                //                 color: '#F44336',
                                //                 '&:hover': {
                                //                     backgroundColor: '#fff3e0',
                                //                 },
                                //             },
                                //             '&:hover': {
                                //                 backgroundColor: '#f5f5f5',
                                //                 transform: 'translateX(4px)'
                                //             }
                                //         }}
                                //         onClick={() => handleClick(`${category.path}`)}
                                //     >
                                //         <ListItemIcon sx={{
                                //             minWidth: 35,
                                //             color: selectedItem === category.path ? '#F44336' : 'inherit'
                                //         }}>
                                //             {category.icon}
                                //         </ListItemIcon>
                                //         <ListItemText
                                //             primary={category.name}
                                //             primaryTypographyProps={{
                                //                 fontSize: '0.85rem',
                                //                 fontWeight: selectedItem === category.path ? 600 : 400
                                //             }}
                                //         />
                                //     </ListItemButton>
                                // </ListItem>
                            ))}

                            {/*<NavItem
                                item="downloads"
                                icon={<CloudDownload />}
                                text="Tải xuống"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="bookmarks"
                                icon={<BookmarkBorder />}
                                text="Đã bookmark"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="history"
                                icon={<History />}
                                text="Lịch sử xem"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="favorites"
                                icon={<Star />}
                                text="Yêu thích"
                                onClick={handleClick}
                                mini={true}
                            /> */}

                            <Divider sx={{ my: 1 }} />

                            <NavItem
                                item="profile"
                                icon={<Person />}
                                text="Thông tin cá nhân"
                                onClick={handleClick}
                                mini={true}
                            />

                            <NavItem
                                item="help"
                                icon={<Help />}
                                text="Trợ giúp"
                                onClick={handleClick}
                                mini={true}
                            />
                        </List>
                    </Box>
                </StyledMiniDrawer>
            )}

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleMobileDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundColor: '#fff',
                        marginTop: '64px',
                        height: 'calc(100vh - 64px)',
                    },
                }}
            >
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        component="img"
                        sx={{
                            height: 48,
                            width: 216,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt="Logo"
                        src="/logoBig.png"
                    />
                </Box>
                <Divider />
                <Box>
                    <List>
                        <NavItem
                            item=""
                            icon={<Home />}
                            text="Trang chủ"
                            onClick={handleClick}
                            mini={false}
                        />
                        <NavItem
                            item="courses"
                            icon={<School />}
                            text="Môn học"
                            onClick={handleClick}
                            mini={false}
                        />

                        <Divider sx={{ my: 1 }} />

                        <ListItem disablePadding>
                            <ListItemButton onClick={handleDocumentsClick} sx={{ borderRadius: 1, mx: 1, my: 0.5, transition: 'all 0.2s ease-in-out', '&:hover': { backgroundColor: '#f5f5f5', transform: 'translateX(2px)' } }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Folder />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Tài liệu"
                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                />
                                {openDocuments ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={openDocuments} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {documentCategories.map((category, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton
                                            selected={selectedItem === category.path}
                                            sx={{
                                                pl: 6,
                                                borderRadius: 1,
                                                mx: 1,
                                                my: 0.25,
                                                transition: 'all 0.2s ease-in-out',
                                                '&.Mui-selected': {
                                                    backgroundColor: '#fff3e0',
                                                    color: '#F44336',
                                                    '&:hover': {
                                                        backgroundColor: '#fff3e0',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                            onClick={() => {
                                                handleClick(`${category.path}`);
                                                handleMobileDrawerToggle();
                                            }}
                                        >
                                            <ListItemIcon sx={{
                                                minWidth: 35,
                                                color: selectedItem === category.path ? '#F44336' : 'inherit'
                                            }}>
                                                {category.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={category.name}
                                                primaryTypographyProps={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: selectedItem === category.path ? 600 : 400
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    color: selectedItem === category.path ? '#F44336' : 'text.secondary',
                                                    fontWeight: selectedItem === category.path ? 600 : 400
                                                }}
                                            >
                                                {category.count}
                                            </Typography>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>

                        <Divider sx={{ my: 1 }} />

                        <NavItem
                            item="downloads"
                            icon={<CloudDownload />}
                            text="Tải xuống"
                            onClick={(item) => {
                                handleClick(item);
                                handleMobileDrawerToggle();
                            }}
                            chip={studentStats.totalDownloads}
                            mini={false}
                        />

                        <NavItem
                            item="bookmarks"
                            icon={<BookmarkBorder />}
                            text="Đã bookmark"
                            onClick={(item) => {
                                handleClick(item);
                                handleMobileDrawerToggle();
                            }}
                            chip={studentStats.bookmarkedDocs}
                            mini={false}
                        />

                        <NavItem
                            item="profile"
                            icon={<Person />}
                            text="Thông tin cá nhân"
                            onClick={(item) => {
                                handleClick(item);
                                handleMobileDrawerToggle();
                            }}
                            mini={false}
                        />
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                transition: 'margin-left 0.3s ease-in-out',
                width: '100%'
            }}>
                {/* Top Bar */}
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: 'white',
                        color: '#333',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        width: '100%',
                        left: 0
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', background: 'white' }}>
                        {/* Mobile Menu Button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                color="inherit"
                                onClick={handleMobileDrawerToggle}
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    color: '#666'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                Thư viện học liệu
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                {studentInfo.semester}
                            </Typography>
                        </Box>

                        {/* Phần giữa - Search và Quick Access */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <form onSubmit={handleSearchSubmit}>
                                    <StyledInputBase
                                        placeholder="Tìm kiếm tài liệu"
                                        inputProps={{ 'aria-label': 'search' }}
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />
                                </form>
                            </Search>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Truy cập nhanh">
                                    <IconButton
                                        size="small"
                                        onClick={handleQuickAccessClick}
                                        sx={{ color: '#666' }}
                                    >
                                        <MenuBook />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Tài liệu đã bookmark">
                                    <IconButton size="small" sx={{ color: '#666' }}>
                                        <Bookmark />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Lịch sử tải">
                                    <IconButton size="small" sx={{ color: '#666' }}>
                                        <History />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Right side - User info và actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Chip
                                    icon={<Download />}
                                    label={`${studentInfo.downloadCount}/20`}
                                    size="small"
                                    color={studentInfo.downloadCount > 15 ? "warning" : "default"}
                                    sx={{ fontSize: '0.7rem' }}
                                />
                            </Box>

                            <IconButton color="inherit" onClick={handleNotificationClick}>
                                <Badge badgeContent={3} color="error">
                                    <Notifications />
                                </Badge>
                            </IconButton>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                        {studentInfo.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                                        {studentInfo.studentId}
                                    </Typography>
                                </Box>
                                <IconButton color="inherit" onClick={handleProfileClick}>
                                    <AccountCircle />
                                </IconButton>
                            </Box>
                        </Box>
                    </Toolbar>

                    {/* Menus */}
                    {/* Updated Notifications Menu */}
                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleClose}
                        PaperProps={{ sx: { width: 380, maxHeight: 500 } }}
                    >
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
                                Thông báo
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                                {notifications.filter(n => !n.isRead).length} thông báo chưa đọc
                            </Typography>
                        </Box>
                        
                        {notifications.slice(0, 3).map((notification, index) => (
                            <MenuItem 
                                key={notification._id}
                                onClick={() => handleNotificationItemClick(notification)}
                                sx={{ 
                                    px: 2, 
                                    py: 1.5,
                                    borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none',
                                    '&:hover': { bgcolor: '#f8f9fa' }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                                    <Avatar sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        mr: 2, 
                                        ...getTypeColor(notification.type)
                                    }}>
                                        {getTypeIcon(notification.type)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: notification.isRead ? 400 : 600, 
                                                mb: 0.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#666', 
                                                fontSize: '0.75rem',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                mb: 0.5
                                            }}
                                        >
                                            {notification.courseName || notification.content.substring(0, 50) + '...'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                                            {formatTimeAgo(notification.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                        {notification.isNew && (
                                            <Chip 
                                                label="Mới" 
                                                size="small" 
                                                color="error" 
                                                sx={{ fontSize: '0.6rem', height: 18 }} 
                                            />
                                        )}
                                        <Chip
                                            label={getTypeLabel(notification.type)}
                                            size="small"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 18,
                                                ...getTypeColor(notification.type)
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                        
                        <Divider />
                        
                        <Box sx={{ p: 1 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleViewAllNotifications}
                                sx={{
                                    borderColor: '#d32f2f',
                                    color: '#d32f2f',
                                    '&:hover': {
                                        borderColor: '#b71c1c',
                                        bgcolor: '#ffebee'
                                    }
                                }}
                            >
                                Xem tất cả thông báo
                            </Button>
                        </Box>
                    </Menu>


                    <Menu
                        anchorEl={profileAnchorEl}
                        open={Boolean(profileAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Thông tin cá nhân</MenuItem>
                        <MenuItem onClick={handleClose}>Lịch sử tải</MenuItem>
                        <MenuItem onClick={handleClose}>Cài đặt</MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Menu>

                    <Menu
                        anchorEl={quickAccessAnchorEl}
                        open={Boolean(quickAccessAnchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Môn học hiện tại</MenuItem>
                        <MenuItem onClick={handleClose}>Tài liệu gần đây</MenuItem>
                        <MenuItem onClick={handleClose}>Danh mục yêu thích</MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>Đề thi - Bài tập</MenuItem>
                        <MenuItem onClick={handleClose}>Giáo trình chính thức</MenuItem>
                    </Menu>
                </AppBar>

                {/* Content Area */}
                <Box sx={{ backgroundColor: 'background.default' }}>
                    <Outlet></Outlet>
                </Box>
                <NotificationModal />
            </Box>
        </Box>
    );
};

export default StudentCourseSelection;