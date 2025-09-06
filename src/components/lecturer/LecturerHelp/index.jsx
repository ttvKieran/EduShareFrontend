import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    IconButton,
    Alert,
    Tooltip,
    Paper,
    Tab,
    Tabs,
    Badge,
    Link,
    Breadcrumbs,
    MenuItem,
} from '@mui/material';
import {
    ExpandMore,
    Search,
    Help as HelpIcon,
    QuestionAnswer,
    VideoLibrary,
    Description,
    Phone,
    Email,
    Chat,
    Download,
    School,
    Assignment,
    Grade,
    LibraryBooks,
    PeopleAlt,
    Settings,
    Report,
    Launch,
    Schedule,
    Announcement,
    CloudUpload,
    Analytics,
    NavigateNext,
    PlayArrow,
    GetApp,
    Feedback,
    Support,
    ContactSupport,
    LiveHelp,
    MenuBook,
    OndemandVideo,
    Forum,
    Article,
    Star,
    ThumbUp,
    Visibility,
    AccessTime,
    PersonAdd,
    Edit,
    Delete,
    Share,
    Print,
    BookmarkBorder,
    Close,
    Send
} from '@mui/icons-material';

const LecturerHelp = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        type: '',
        subject: '',
        message: '',
        rating: 0
    });

    // Mock data
    const helpStats = {
        totalGuides: 45,
        totalVideos: 28,
        totalFAQs: 67,
        avgRating: 4.7,
        responseTime: '< 2 giờ'
    };

    const quickGuides = [
        {
            id: 1,
            title: "Cách tạo môn học mới",
            description: "Hướng dẫn từng bước tạo và cấu hình môn học",
            icon: <School />,
            category: "Quản lý môn học",
            time: "5 phút",
            difficulty: "Dễ",
            views: 1247,
            rating: 4.8
        },
        {
            id: 2,
            title: "Upload và quản lý tài liệu",
            description: "Cách upload, phân loại và chia sẻ tài liệu giảng dạy",
            icon: <CloudUpload />,
            category: "Tài liệu",
            time: "7 phút",
            difficulty: "Dễ",
            views: 985,
            rating: 4.6
        },
        {
            id: 3,
            title: "Nhập điểm và đánh giá",
            description: "Hướng dẫn nhập điểm, tạo bảng điểm và đánh giá sinh viên",
            icon: <Grade />,
            category: "Quản lý điểm",
            time: "10 phút",
            difficulty: "Trung bình",
            views: 756,
            rating: 4.9
        },
        {
            id: 4,
            title: "Quản lý lớp học và sinh viên",
            description: "Cách thêm, xóa sinh viên và quản lý thông tin lớp",
            icon: <PeopleAlt />,
            category: "Quản lý sinh viên",
            time: "8 phút",
            difficulty: "Dễ",
            views: 1123,
            rating: 4.7
        },
        {
            id: 5,
            title: "Tạo thông báo và giao tiếp",
            description: "Gửi thông báo, tạo diễn đàn thảo luận với sinh viên",
            icon: <Announcement />,
            category: "Giao tiếp",
            time: "6 phút",
            difficulty: "Dễ",
            views: 892,
            rating: 4.5
        },
        {
            id: 6,
            title: "Sử dụng báo cáo và thống kê",
            description: "Cách xem và tạo các báo cáo tiến độ học tập",
            icon: <Analytics />,
            category: "Báo cáo",
            time: "12 phút",
            difficulty: "Khó",
            views: 534,
            rating: 4.8
        }
    ];

    const videoTutorials = [
        {
            id: 1,
            title: "Giới thiệu tổng quan hệ thống",
            thumbnail: "/api/placeholder/320/180",
            duration: "15:30",
            category: "Cơ bản",
            instructor: "PGS. Nguyễn Văn A",
            views: 2341,
            likes: 89,
            description: "Video giới thiệu toàn bộ tính năng và cách sử dụng hệ thống quản lý giảng dạy",
            uploadDate: "2025-01-15"
        },
        {
            id: 2,
            title: "Quản lý môn học nâng cao",
            thumbnail: "/api/placeholder/320/180",
            duration: "22:45",
            category: "Nâng cao",
            instructor: "TS. Trần Thị B",
            views: 1876,
            likes: 76,
            description: "Hướng dẫn chi tiết các tính năng nâng cao trong quản lý môn học",
            uploadDate: "2025-01-10"
        },
        {
            id: 3,
            title: "Tối ưu hóa quy trình giảng dạy",
            thumbnail: "/api/placeholder/320/180",
            duration: "18:20",
            category: "Mẹo hay",
            instructor: "PGS. Lê Văn C",
            views: 1523,
            likes: 92,
            description: "Các mẹo và thủ thuật giúp tối ưu hóa quy trình giảng dạy",
            uploadDate: "2025-01-05"
        }
    ];

    const faqData = [
        {
            category: "Quản lý môn học",
            questions: [
                {
                    question: "Làm thế nào để tạo một môn học mới?",
                    answer: "Để tạo môn học mới, bạn truy cập vào mục 'Quản lý Môn học' > 'Tạo môn học mới', điền đầy đủ thông tin như tên môn học, mã môn, số tín chỉ, mô tả và lịch học. Sau đó nhấn 'Lưu' để hoàn tất.",
                    tags: ["tạo", "môn học", "cơ bản"],
                    helpful: 45,
                    views: 234
                },
                {
                    question: "Có thể chỉnh sửa thông tin môn học sau khi đã tạo không?",
                    answer: "Có, bạn có thể chỉnh sửa thông tin môn học bất kỳ lúc nào. Truy cập vào danh sách môn học, chọn môn cần sửa và nhấn nút 'Chỉnh sửa'. Lưu ý rằng một số thông tin như mã môn học có thể không thể thay đổi sau khi đã có sinh viên đăng ký.",
                    tags: ["chỉnh sửa", "cập nhật"],
                    helpful: 38,
                    views: 187
                }
            ]
        },
        {
            category: "Quản lý sinh viên",
            questions: [
                {
                    question: "Cách thêm sinh viên vào lớp học?",
                    answer: "Bạn có thể thêm sinh viên theo 2 cách: (1) Thêm thủ công bằng cách nhập thông tin từng sinh viên, (2) Import danh sách từ file Excel. Truy cập 'Quản lý sinh viên' > 'Thêm sinh viên' để thực hiện.",
                    tags: ["thêm", "sinh viên", "import"],
                    helpful: 52,
                    views: 298
                },
                {
                    question: "Làm thế nào để gửi thông báo cho toàn bộ lớp?",
                    answer: "Vào mục 'Thông báo cho lớp', chọn lớp học, viết nội dung thông báo và chọn phương thức gửi (email, notification trong hệ thống, hoặc cả hai). Bạn cũng có thể lên lịch gửi thông báo tự động.",
                    tags: ["thông báo", "gửi", "lớp học"],
                    helpful: 41,
                    views: 156
                }
            ]
        },
        {
            category: "Quản lý điểm",
            questions: [
                {
                    question: "Quy trình nhập điểm như thế nào?",
                    answer: "Truy cập 'Quản lý điểm' > chọn môn học > chọn loại điểm (giữa kỳ, cuối kỳ, bài tập...) > nhập điểm cho từng sinh viên. Hệ thống sẽ tự động tính điểm tổng kết theo công thức đã cài đặt.",
                    tags: ["nhập điểm", "tính điểm"],
                    helpful: 67,
                    views: 445
                }
            ]
        }
    ];

    const contactMethods = [
        {
            type: "Hotline",
            value: "1900-1234",
            icon: <Phone />,
            color: "#4caf50",
            description: "Hỗ trợ 24/7",
            available: true
        },
        {
            type: "Email",
            value: "support@university.edu.vn",
            icon: <Email />,
            color: "#2196f3",
            description: "Phản hồi trong 2-4 giờ",
            available: true
        },
        {
            type: "Live Chat",
            value: "Chat trực tuyến",
            icon: <Chat />,
            color: "#ff9800",
            description: "8:00 - 17:00 (T2-T6)",
            available: false
        },
        {
            type: "Ticket",
            value: "Tạo ticket hỗ trợ",
            icon: <Support />,
            color: "#9c27b0",
            description: "Theo dõi tiến độ xử lý",
            available: true
        }
    ];

    // Event handlers
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleVideoPlay = (video) => {
        setSelectedVideo(video);
        setVideoDialogOpen(true);
    };

    const handleContactClick = (method) => {
        if (method.type === "Live Chat" && !method.available) {
            return;
        }
        setContactDialogOpen(true);
    };

    const handleFeedbackSubmit = () => {
        console.log('Feedback submitted:', feedbackForm);
        setFeedbackDialogOpen(false);
        setFeedbackForm({ type: '', subject: '', message: '', rating: 0 });
    };

    const filteredGuides = quickGuides.filter(guide =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Dễ': return '#4caf50';
            case 'Trung bình': return '#ff9800';
            case 'Khó': return '#f44336';
            default: return '#666';
        }
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
                    <Link color="inherit" href="/lecturer" sx={{ display: 'flex', alignItems: 'center' }}>
                        <School sx={{ mr: 0.5 }} fontSize="inherit" />
                        Trang chủ
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <HelpIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Trợ giúp
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                            🚀 Trung tâm Trợ giúp
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Tìm kiếm hướng dẫn, video tutorial và liên hệ hỗ trợ kỹ thuật
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Feedback />}
                            onClick={() => setFeedbackDialogOpen(true)}
                            sx={{ borderRadius: 2 }}
                        >
                            Góp ý
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ContactSupport />}
                            onClick={() => setContactDialogOpen(true)}
                            sx={{ borderRadius: 2, bgcolor: '#1976d2' }}
                        >
                            Liên hệ hỗ trợ
                        </Button>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd', border: '1px solid #2196f3' }}>
                            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
                                {helpStats.totalGuides}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hướng dẫn
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                            <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 700 }}>
                                {helpStats.totalVideos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Video hướng dẫn
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8', border: '1px solid #4caf50' }}>
                            <Typography variant="h4" sx={{ color: '#388e3c', fontWeight: 700 }}>
                                {helpStats.totalFAQs}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Câu hỏi thường gặp
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 700 }}>
                                    {helpStats.avgRating}
                                </Typography>
                                <Star sx={{ color: '#ff9800' }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Đánh giá trung bình
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee', border: '1px solid #f44336' }}>
                            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                                {helpStats.responseTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Thời gian phản hồi
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Search Bar */}
                <Card sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm hướng dẫn, câu hỏi, video..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                        }}
                    />
                    
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Tìm kiếm phổ biến:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {['Tạo môn học', 'Nhập điểm', 'Upload tài liệu', 'Quản lý sinh viên', 'Báo cáo'].map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setSearchQuery(tag)}
                                    sx={{ 
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: '#e3f2fd', borderColor: '#1976d2' }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Tabs */}
            <Card sx={{ borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                        <Tab
                            icon={<MenuBook />}
                            label="Hướng dẫn nhanh"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                        <Tab
                            icon={<OndemandVideo />}
                            label="Video hướng dẫn"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                        <Tab
                            icon={<Forum />}
                            label="Câu hỏi thường gặp"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                        <Tab
                            icon={<ContactSupport />}
                            label="Liên hệ hỗ trợ"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: 3 }}>
                    {/* Tab 0: Quick Guides */}
                    {selectedTab === 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    📚 Hướng dẫn nhanh ({filteredGuides.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<GetApp />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Tải tài liệu PDF
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                {filteredGuides.map((guide) => (
                                    <Grid item xs={12} md={6} lg={4} key={guide.id}>
                                        <Card sx={{
                                            height: '100%',
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 2 }}>
                                                        {guide.icon}
                                                    </Avatar>
                                                    <Chip
                                                        label={guide.category}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, flex: '0 0 auto' }}>
                                                    {guide.title}
                                                </Typography>
                                                
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                                                    {guide.description}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                        <Chip
                                                            label={guide.difficulty}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getDifficultyColor(guide.difficulty),
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                        <Chip
                                                            label={guide.time}
                                                            size="small"
                                                            variant="outlined"
                                                            icon={<AccessTime />}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Visibility sx={{ fontSize: 16, color: '#666' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {guide.views.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Star sx={{ fontSize: 16, color: '#ff9800' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {guide.rating}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ flex: 1, borderRadius: 2 }}
                                                    >
                                                        Xem hướng dẫn
                                                    </Button>
                                                    <IconButton size="small" sx={{ color: '#666' }}>
                                                        <BookmarkBorder />
                                                    </IconButton>
                                                    <IconButton size="small" sx={{ color: '#666' }}>
                                                        <Share />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 1: Video Tutorials */}
                    {selectedTab === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    🎥 Video hướng dẫn ({videoTutorials.length})
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<VideoLibrary />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Xem tất cả
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                {videoTutorials.map((video) => (
                                    <Grid item xs={12} md={6} lg={4} key={video.id}>
                                        <Card sx={{
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                            }
                                        }}>
                                            <Box sx={{ position: 'relative' }}>
                                                <Box
                                                    sx={{
                                                        height: 180,
                                                        bgcolor: '#f0f0f0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleVideoPlay(video)}
                                                >
                                                    <PlayArrow sx={{ fontSize: 60, color: '#1976d2' }} />
                                                </Box>
                                                <Chip
                                                    label={video.duration}
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(0,0,0,0.7)',
                                                        color: 'white'
                                                    }}
                                                />
                                                <Chip
                                                    label={video.category}
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        left: 8
                                                    }}
                                                />
                                            </Box>

                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {video.title}
                                                </Typography>
                                                
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {video.description}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1976d2' }}>
                                                        {video.instructor.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            {video.instructor}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(video.uploadDate).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Visibility sx={{ fontSize: 16, color: '#666' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {video.views.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <ThumbUp sx={{ fontSize: 16, color: '#666' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {video.likes}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<PlayArrow />}
                                                    onClick={() => handleVideoPlay(video)}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Xem video
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 2: FAQ */}
                    {selectedTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                ❓ Câu hỏi thường gặp
                            </Typography>

                            {faqData.map((category, categoryIndex) => (
                                <Box key={categoryIndex} sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600, 
                                        mb: 2, 
                                        color: '#1976d2',
                                        borderBottom: '2px solid #e3f2fd',
                                        pb: 1
                                    }}>
                                        {category.category}
                                    </Typography>
                                    
                                    {category.questions.map((faq, faqIndex) => (
                                        <Accordion
                                            key={faqIndex}
                                            sx={{
                                                mb: 1,
                                                borderRadius: 2,
                                                '&:before': { display: 'none' },
                                                border: '1px solid #e0e0e0'
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMore />}
                                                sx={{
                                                    bgcolor: '#f8f9fa',
                                                    borderRadius: '8px 8px 0 0',
                                                    '&.Mui-expanded': {
                                                        borderRadius: '8px 8px 0 0'
                                                    }
                                                }}
                                            >
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {faq.question}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                        {faq.tags.map((tag, tagIndex) => (
                                                            <Chip
                                                                key={tagIndex}
                                                                label={tag}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.7rem' }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ p: 3 }}>
                                                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                                                    {faq.answer}
                                                </Typography>
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            👁️ {faq.views} lượt xem
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            👍 {faq.helpful} hữu ích
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<ThumbUp />}
                                                            variant="outlined"
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Hữu ích
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<Share />}
                                                            variant="outlined"
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Chia sẻ
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Tab 3: Contact Support */}
                    {selectedTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                📞 Liên hệ hỗ trợ
                            </Typography>

                            <Grid container spacing={3}>
                                {contactMethods.map((method, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Card sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            border: `2px solid ${method.color}`,
                                            cursor: method.available ? 'pointer' : 'not-allowed',
                                            opacity: method.available ? 1 : 0.6,
                                            transition: 'all 0.3s ease',
                                            '&:hover': method.available ? {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                            } : {}
                                        }} onClick={() => handleContactClick(method)}>
                                            <Avatar sx={{
                                                bgcolor: method.color,
                                                width: 60,
                                                height: 60,
                                                margin: '0 auto 16px'
                                            }}>
                                                {method.icon}
                                            </Avatar>
                                            
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                {method.type}
                                            </Typography>
                                            
                                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: method.color }}>
                                                {method.value}
                                            </Typography>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                {method.description}
                                            </Typography>
                                            
                                            {!method.available && (
                                                <Chip
                                                    label="Không khả dụng"
                                                    size="small"
                                                    color="error"
                                                    sx={{ mt: 2 }}
                                                />
                                            )}
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Quick Contact Form */}
                            <Card sx={{ mt: 4, p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    ✉️ Gửi yêu cầu hỗ trợ nhanh
                                </Typography>
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Chủ đề"
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Loại vấn đề"
                                            select
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="technical">Lỗi kỹ thuật</MenuItem>
                                            <MenuItem value="account">Tài khoản</MenuItem>
                                            <MenuItem value="feature">Tính năng</MenuItem>
                                            <MenuItem value="other">Khác</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Mô tả chi tiết"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Chúng tôi sẽ phản hồi trong vòng {helpStats.responseTime}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<Send />}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Gửi yêu cầu
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    )}
                </Box>
            </Card>

            {/* Video Dialog */}
            <Dialog
                open={videoDialogOpen}
                onClose={() => setVideoDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedVideo?.title}
                    </Typography>
                    <IconButton onClick={() => setVideoDialogOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedVideo && (
                        <Box>
                            <Box sx={{
                                height: 320,
                                bgcolor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                                mb: 2
                            }}>
                                <PlayArrow sx={{ fontSize: 80, color: '#1976d2' }} />
                            </Box>
                            
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {selectedVideo.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                                        {selectedVideo.instructor.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {selectedVideo.instructor}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {selectedVideo.duration} • {selectedVideo.views.toLocaleString()} lượt xem
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button startIcon={<ThumbUp />} variant="outlined" size="small">
                                        {selectedVideo.likes}
                                    </Button>
                                    <Button startIcon={<Share />} variant="outlined" size="small">
                                        Chia sẻ
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Contact Dialog */}
            <Dialog
                open={contactDialogOpen}
                onClose={() => setContactDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        📞 Liên hệ hỗ trợ
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn 24/7
                    </Alert>
                    
                    <Grid container spacing={2}>
                        {contactMethods.filter(m => m.available).map((method, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: method.color }}>
                                        {method.icon}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {method.type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {method.value} • {method.description}
                                        </Typography>
                                    </Box>
                                    <Button variant="outlined" size="small">
                                        Liên hệ
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setContactDialogOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="contained" startIcon={<LiveHelp />}>
                        Chat trực tuyến
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog
                open={feedbackDialogOpen}
                onClose={() => setFeedbackDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        💬 Góp ý và đánh giá
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Ý kiến của bạn giúp chúng tôi cải thiện chất lượng dịch vụ
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Loại góp ý"
                                select
                                value={feedbackForm.type}
                                onChange={(e) => setFeedbackForm({...feedbackForm, type: e.target.value})}
                            >
                                <MenuItem value="bug">Báo lỗi</MenuItem>
                                <MenuItem value="feature">Đề xuất tính năng</MenuItem>
                                <MenuItem value="improvement">Cải thiện</MenuItem>
                                <MenuItem value="compliment">Khen ngợi</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                value={feedbackForm.subject}
                                onChange={(e) => setFeedbackForm({...feedbackForm, subject: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nội dung chi tiết"
                                multiline
                                rows={4}
                                value={feedbackForm.message}
                                onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Đánh giá chung:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {[1,2,3,4,5].map((star) => (
                                    <IconButton
                                        key={star}
                                        onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                                        sx={{ color: star <= feedbackForm.rating ? '#ff9800' : '#e0e0e0' }}
                                    >
                                        <Star />
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setFeedbackDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleFeedbackSubmit}
                        startIcon={<Send />}
                    >
                        Gửi góp ý
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LecturerHelp;