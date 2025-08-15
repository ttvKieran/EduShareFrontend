import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Grid,
    Container,
    Tabs,
    Tab,
    Paper,
    Avatar,
    Divider,
    IconButton,
    Badge,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Description as DescriptionIcon,
    PictureAsPdf as PdfIcon,
    VideoLibrary as VideoIcon,
    AudioFile as AudioIcon,
    Archive as ArchiveIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Folder as FolderIcon,
    FolderSpecial as FolderSpecialIcon,
    Notifications as NotificationsIcon,
    Info as InfoIcon,
    CalendarToday as CalendarIcon,
    Class as ClassIcon,
    Grade as GradeIcon
} from '@mui/icons-material';
import DocumentsList from '../../shared/DocumentList';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../../configs/system";
import { useAuth } from '../../../contexts/AuthContext';

const DocumentManagementPage = () => {
    const { authenticatedFetch } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const classId = params.classId;
    const [classCurrent, setClassCurrent] = useState();
    const [courseCount, setCourseCount] = useState(0);
    const [classCount, setClassCount] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        console.log(classId);
        const fetchDocuments = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE_URL}/student/classes/${classId}`);
                if (!response.ok) {
                    throw new Error("Failed");
                } else {
                    const res = await response.json();
                    console.log("rés", res);
                    setClassCurrent(res);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchDocuments();
    }, []);

    const [activeTab, setActiveTab] = useState(0);

    // Handle navigation to notifications page
    const handleViewNotifications = () => {
        navigate(`/courses/notifications/${classCurrent?._id}/${classCurrent?.name}`);
    };

    // Truncate description function
    const truncateText = (text, maxLength) => {
        if (!text) return 'Chưa có mô tả cho môn học này.';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // ...existing code for getFileIcon, DocumentCard...

    return (
        <Container maxWidth="lg" sx={{ py: 4, alignContent: 'center' }}>
            {/* Header Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderLeft: '4px solid #d32f2f',
                    borderRadius: '5px',
                    width: '95%', 
                    m: '0 auto',
                    marginBottom: '20px'
                }}
            >
                <Grid container spacing={3} justifyContent={'space-between'}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <SchoolIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
                                    {classCurrent?.courseId.name}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Lớp học phần: {classCurrent?.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<NotificationsIcon />}
                                onClick={handleViewNotifications}
                                sx={{
                                    backgroundColor: 'white',
                                    '&:hover': { bgcolor: '#b71c1c' },
                                    py: 1.5,
                                    px: 3,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                Xem thông báo
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Course Description Section */}
            <Paper 
                elevation={2} 
                sx={{ 
                    mb: 3, 
                    borderRadius: '5px', 
                    width: '95%', 
                    m: '0 auto 24px auto'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <InfoIcon sx={{ fontSize: 28, color: '#d32f2f', mr: 2 }} />
                        <Typography 
                            variant="h5" 
                            component="h2" 
                            sx={{ 
                                fontWeight: 600, 
                                color: '#333'
                            }}
                        >
                            Thông tin môn học
                        </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            lineHeight: 1.8,
                            color: '#444',
                            fontSize: '1rem',
                            textAlign: 'justify',
                            whiteSpace: 'pre-line' // Giữ format xuống dòng từ database
                        }}
                    >
                        {showFullDescription 
                            ? (classCurrent?.courseId.description || 'Chưa có mô tả chi tiết cho môn học này. Vui lòng liên hệ với giảng viên để biết thêm thông tin.')
                            : truncateText(classCurrent?.courseId.description, 300)
                        }
                    </Typography>
                    
                    {classCurrent?.courseId.description && classCurrent.courseId.description.length > 300 && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="text"
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                sx={{ 
                                    color: '#d32f2f',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    '&:hover': { 
                                        bgcolor: '#ffebee',
                                        borderRadius: '20px'
                                    }
                                }}
                            >
                                {showFullDescription ? 'Thu gọn ↑' : 'Xem thêm ↓'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Paper>

            {/* Tabs Section */}
            <Paper elevation={2} sx={{ mb: 1, borderRadius: '5px', width: '95%', m: '0 auto' }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            py: 2,
                            fontSize: '1rem',
                            fontWeight: 600
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#d32f2f',
                            height: 3
                        }
                    }}
                >
                    <Tab
                        icon={<FolderIcon />}
                        label={`Tài liệu môn học ${courseCount && courseCount > 0 ? `(${courseCount})` : ""}`}
                        iconPosition="top"
                    />
                    <Tab
                        icon={<FolderSpecialIcon />}
                        label={`Tài liệu lớp học phần ${classCount && classCount > 0 ? `(${classCount})` : ""}`}
                        iconPosition="top"
                    />
                </Tabs>
            </Paper>

            {/* Content Section */}
            <Box sx={{ minHeight: '400px' }}>
                {activeTab === 0 && classCurrent && (
                    <DocumentsList
                        typeSelect=""
                        typeName="Cơ sở dữ liệu phân tán"
                        nav="Môn học"
                        navHref="/courses"
                        courseId={classCurrent.courseId._id}
                        search="false"
                        setCourseCount={setCourseCount}
                    />
                )}

                {activeTab === 1 && (
                    <DocumentsList
                        typeSelect=""
                        typeName="Cơ sở dữ liệu phân tán"
                        nav="Môn học"
                        navHref="/courses"
                        classId={classId}
                        search="true"
                        setClassCount={setClassCount}
                    />
                )}
            </Box>
        </Container>
    );
};

export default DocumentManagementPage;