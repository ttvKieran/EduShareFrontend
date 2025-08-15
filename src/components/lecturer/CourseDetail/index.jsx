import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  Alert,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Switch,
  FormControlLabel,
  Stack,
  TablePagination,
  Checkbox,
  AvatarGroup,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Analytics,
  School as SchoolIcon,
  CloudUpload as UploadIcon, // Fixed: Changed from Upload to CloudUpload
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  MenuBook as MenuBookIcon,
  Class as ClassIcon,
  Announcement as AnnouncementIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentList from '../DocumentList';
import Classes from '../Classes';

const CourseDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  // States
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);

  // Form states
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    sendEmail: true
  });

  // Mock data - Course (môn học chung)
  const mockCourse = {
    id: parseInt(courseId),
    code: 'IT3040',
    name: 'Lập trình hướng đối tượng',
    englishName: 'Object-Oriented Programming',
    description: 'Môn học giới thiệu các khái niệm cơ bản về lập trình hướng đối tượng sử dụng ngôn ngữ Java. Bao gồm: class, object, inheritance, polymorphism, encapsulation và abstraction.',
    credits: 3,
    department: 'Khoa học máy tính',
    category: 'Bắt buộc',
    level: 'Đại học',
    prerequisites: ['IT3020', 'IT3030'],
    status: 'active',
    totalClasses: 8, // Tổng số lớp học của môn này
    totalStudents: 280, // Tổng sinh viên của tất cả lớp
    totalDocuments: 35, // Tổng tài liệu của môn học
    totalAnnouncements: 12, // Tổng thông báo
    createdAt: '2023-01-15',
    updatedAt: '2024-08-15',
    instructor: {
      id: 1,
      name: 'TS. Nguyễn Văn Minh',
      email: 'nvminh@university.edu.vn',
      avatar: '/api/placeholder/50/50'
    },
    syllabus: {
      objectives: [
        'Hiểu được các khái niệm cơ bản về OOP',
        'Thành thạo lập trình Java cơ bản',
        'Áp dụng được các design pattern cơ bản',
        'Phát triển được ứng dụng Java đơn giản'
      ],
      topics: [
        'Giới thiệu về Java và OOP',
        'Class và Object',
        'Inheritance và Polymorphism',
        'Interface và Abstract Class',
        'Exception Handling',
        'Collections Framework',
        'File I/O',
        'GUI với Swing'
      ]
    }
  };

  // Mock announcements for course (thông báo chung của môn học)
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Cập nhật chương trình học môn OOP 2024',
      content: 'Chương trình học đã được cập nhật với những kiến thức mới nhất về Java 17. Tất cả các lớp sẽ áp dụng từ tuần tới.',
      priority: 'high',
      createdAt: '2024-08-10T10:30:00Z',
      updatedAt: '2024-08-10T10:30:00Z',
      pinned: true,
      views: 245,
      comments: 12,
      targetClasses: ['IT3040.20241.001', 'IT3040.20241.002', 'IT3040.20241.003']
    },
    {
      id: 2,
      title: 'Tài liệu tham khảo mới cho môn học',
      content: 'Đã tải lên bộ tài liệu tham khảo mới bao gồm slides, bài tập và video hướng dẫn.',
      priority: 'normal',
      createdAt: '2024-08-08T14:20:00Z',
      updatedAt: '2024-08-08T14:20:00Z',
      pinned: false,
      views: 189,
      comments: 8,
      targetClasses: ['all']
    },
    {
      id: 3,
      title: 'Thay đổi phương pháp đánh giá cuối kỳ',
      content: 'Từ học kỳ này, bài thi cuối kỳ sẽ có 40% lý thuyết và 60% thực hành trên máy tính.',
      priority: 'high',
      createdAt: '2024-08-05T09:15:00Z',
      updatedAt: '2024-08-05T09:15:00Z',
      pinned: true,
      views: 298,
      comments: 15,
      targetClasses: ['all']
    }
  ];

  // Mock classes (các lớp học cụ thể của môn này)
  const mockClasses = [
    {
      id: 1,
      classCode: 'IT3040.20241.001',
      semester: '2024.1',
      semesterName: 'Học kỳ I năm 2024-2025',
      maxStudents: 45,
      enrolledStudents: 42,
      status: 'active',
      schedule: [
        { day: 'Thứ 2', time: '08:00-09:30', room: 'Lab A2', type: 'Lý thuyết' },
        { day: 'Thứ 4', time: '08:00-09:30', room: 'Lab A2', type: 'Thực hành' }
      ],
      progress: 65,
      nextClass: '2024-08-15T08:00:00Z',
      avgGrade: 8.2,
      assignments: 8,
      discussions: 12
    },
    {
      id: 2,
      classCode: 'IT3040.20241.002',
      semester: '2024.1',
      semesterName: 'Học kỳ I năm 2024-2025',
      maxStudents: 45,
      enrolledStudents: 38,
      status: 'active',
      schedule: [
        { day: 'Thứ 3', time: '10:00-11:30', room: 'Lab B1', type: 'Lý thuyết' },
        { day: 'Thứ 5', time: '10:00-11:30', room: 'Lab B1', type: 'Thực hành' }
      ],
      progress: 62,
      nextClass: '2024-08-16T10:00:00Z',
      avgGrade: 7.8,
      assignments: 8,
      discussions: 9
    },
    {
      id: 3,
      classCode: 'IT3040.20241.003',
      semester: '2024.1',
      semesterName: 'Học kỳ I năm 2024-2025',
      maxStudents: 45,
      enrolledStudents: 44,
      status: 'active',
      schedule: [
        { day: 'Thứ 2', time: '14:00-15:30', room: 'Lab C3', type: 'Lý thuyết' },
        { day: 'Thứ 4', time: '14:00-15:30', room: 'Lab C3', type: 'Thực hành' }
      ],
      progress: 68,
      nextClass: '2024-08-15T14:00:00Z',
      avgGrade: 8.5,
      assignments: 8,
      discussions: 15
    },
    {
      id: 4,
      classCode: 'IT3040.20232.001',
      semester: '2023.2',
      semesterName: 'Học kỳ II năm 2023-2024',
      maxStudents: 45,
      enrolledStudents: 41,
      status: 'completed',
      schedule: [
        { day: 'Thứ 3', time: '08:00-09:30', room: 'Lab A1', type: 'Lý thuyết' },
        { day: 'Thứ 5', time: '08:00-09:30', room: 'Lab A1', type: 'Thực hành' }
      ],
      progress: 100,
      nextClass: null,
      avgGrade: 7.9,
      assignments: 10,
      discussions: 18
    },
    {
      id: 5,
      classCode: 'IT3040.20232.002',
      semester: '2023.2',
      semesterName: 'Học kỳ II năm 2023-2024',
      maxStudents: 45,
      enrolledStudents: 39,
      status: 'completed',
      schedule: [
        { day: 'Thứ 6', time: '10:00-11:30', room: 'Lab B2', type: 'Lý thuyết' },
        { day: 'Thứ 7', time: '10:00-11:30', room: 'Lab B2', type: 'Thực hành' }
      ],
      progress: 100,
      nextClass: null,
      avgGrade: 8.1,
      assignments: 10,
      discussions: 14
    }
  ];

  // Mock documents for course
  const mockDocumentsDetailed = [
    {
      _id: '1',
      title: 'Giáo trình Lập trình hướng đối tượng với Java',
      description: 'Giáo trình chính thức của môn học, bao gồm tất cả lý thuyết và bài tập thực hành',
      type: 'curriculum',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 15728640, // 15MB
      viewCount: 342,
      downloadCount: 298,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-08-01T09:00:00Z',
      category: 'curriculum',
      isPublished: true,
      tags: ['java', 'oop', 'textbook', 'official']
    },
    {
      _id: '2',
      title: 'Slide tổng hợp - Các khái niệm OOP cơ bản',
      description: 'Bộ slide tổng hợp về Class, Object, Inheritance, Polymorphism, Encapsulation',
      type: 'lecture',
      mimeType: 'application/vnd.ms-powerpoint',
      fileType: 'ppt',
      fileSize: 8388608, // 8MB
      viewCount: 156,
      downloadCount: 142,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-02-10T10:30:00Z',
      updatedAt: '2024-08-10T10:30:00Z',
      category: 'lecture',
      isPublished: true,
      tags: ['slides', 'oop', 'concepts', 'theory']
    },
    {
      _id: '3',
      title: 'Bộ bài tập thực hành Java OOP',
      description: 'Tuyển tập 50 bài tập thực hành từ cơ bản đến nâng cao về lập trình OOP với Java',
      type: 'exercise',
      mimeType: 'application/zip',
      fileType: 'zip',
      fileSize: 5242880, // 5MB
      viewCount: 289,
      downloadCount: 245,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-02-20T14:00:00Z',
      updatedAt: '2024-08-05T16:45:00Z',
      category: 'exercise',
      isPublished: true,
      tags: ['exercises', 'practice', 'java', 'programming']
    },
    {
      _id: '4',
      title: 'Video bài giảng - Design Patterns trong Java',
      description: 'Series video về các mẫu thiết kế phổ biến: Singleton, Observer, Factory, Strategy',
      type: 'reference',
      mimeType: 'video/mp4',
      fileType: 'mp4',
      fileSize: 524288000, // 500MB
      viewCount: 78,
      downloadCount: 45,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-03-15T11:20:00Z',
      updatedAt: '2024-03-15T11:20:00Z',
      category: 'lecture',
      isPublished: true,
      tags: ['video', 'design-patterns', 'advanced', 'java']
    },
    {
      _id: '5',
      title: 'Đề thi tham khảo các năm trước',
      description: 'Bộ sưu tập đề thi cuối kỳ các năm 2020-2023 kèm đáp án chi tiết',
      type: 'exam',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 3145728, // 3MB
      viewCount: 412,
      downloadCount: 378,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-01-20T16:00:00Z',
      updatedAt: '2024-08-01T10:00:00Z',
      category: 'exam',
      isPublished: true,
      tags: ['exam', 'reference', 'sample', 'answer-key']
    },
    {
      _id: '6',
      title: 'Hướng dẫn setup môi trường phát triển',
      description: 'Hướng dẫn chi tiết cài đặt JDK, Eclipse IDE, IntelliJ IDEA cho các hệ điều hành',
      type: 'reference',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 2097152, // 2MB
      viewCount: 234,
      downloadCount: 189,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-01-10T08:30:00Z',
      updatedAt: '2024-07-20T15:20:00Z',
      category: 'guide',
      isPublished: true,
      tags: ['setup', 'ide', 'jdk', 'development']
    }
  ];

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setCourse(mockCourse);
      setAnnouncements(mockAnnouncements);
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, [courseId]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'default';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Bản nháp';
      case 'paused': return 'Tạm dừng';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'normal': return 'primary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Event handlers
  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', announcementForm);
    setCreateAnnouncementOpen(false);
    setAnnouncementForm({ title: '', content: '', priority: 'normal', sendEmail: true });
  };

  const handleViewClass = (classItem) => {
    navigate(`/lecturer/classes/${classItem.id}`);
  };

  // Document handlers
  const handleDocumentPreview = (document) => {
    console.log('Preview document:', document);
  };

  const handleDocumentDownload = (document) => {
    console.log('Download document:', document);
  };

  const handleDocumentEdit = (document) => {
    console.log('Edit document:', document);
  };

  const handleDocumentDelete = (document) => {
    console.log('Delete document:', document);
  };

  const handleDocumentTogglePublish = (document) => {
    console.log('Toggle publish:', document);
  };

  const handleDocumentUpload = () => {
    setUploadDocumentOpen(true);
  };

  // Tab Panel Component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Course Overview Component
  const CourseOverview = () => (
    <Grid container spacing={3}>
      {/* Course Info */}
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📚 Thông tin môn học
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Mã môn học" secondary={course.code} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Số tín chỉ" secondary={`${course.credits} tín chỉ`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Khoa/Bộ môn" secondary={course.department} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Loại môn học" secondary={course.category} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Bậc học" secondary={course.level} />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Môn tiên quyết" 
                      secondary={course.prerequisites.length > 0 ? course.prerequisites.join(', ') : 'Không có'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Trạng thái" secondary={
                      <Chip label={getStatusLabel(course.status)} color={getStatusColor(course.status)} size="small" />
                    } />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Cập nhật cuối" secondary={formatDate(course.updatedAt)} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Course Statistics */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              📊 Thống kê tổng quan
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                    {course.totalClasses}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lớp học
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                    {course.totalStudents}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sinh viên
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                    {course.totalDocuments}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tài liệu
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 600 }}>
                    {course.totalAnnouncements}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Thông báo
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Course Actions */}
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              ⚡ Thao tác nhanh
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AnnouncementIcon />}
                onClick={() => setCreateAnnouncementOpen(true)}
              >
                Tạo thông báo
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<UploadIcon />} /* Fixed: Now using UploadIcon */
                onClick={() => setUploadDocumentOpen(true)}
              >
                Tải tài liệu
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ClassIcon />}
                onClick={() => setTabValue(3)}
              >
                Xem lớp học
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Analytics />}
              >
                Xem báo cáo
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Course Objectives */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🎯 Mục tiêu môn học
            </Typography>
            <List dense>
              {course.syllabus.objectives.map((objective, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {index + 1}.
                    </Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary={objective}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Announcements Component
  const AnnouncementsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          📢 Thông báo chung môn học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateAnnouncementOpen(true)}
        >
          Tạo thông báo
        </Button>
      </Box>

      <Stack spacing={2}>
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {announcement.title}
                    </Typography>
                    {announcement.pinned && (
                      <Chip label="Ghim" size="small" color="secondary" />
                    )}
                    <Chip
                      label={announcement.priority.toUpperCase()}
                      size="small"
                      color={getPriorityColor(announcement.priority)}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {announcement.content}
                  </Typography>
                  
                  {/* Target Classes */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Áp dụng cho:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {announcement.targetClasses.includes('all') ? (
                        <Chip label="Tất cả các lớp" size="small" color="info" variant="outlined" />
                      ) : (
                        announcement.targetClasses.map((classCode) => (
                          <Chip key={classCode} label={classCode} size="small" variant="outlined" />
                        ))
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(announcement.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      👁 {announcement.views} lượt xem
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      💬 {announcement.comments} bình luận
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  // Documents Component
  const DocumentsTab = () => (
    <DocumentList
      documents={mockDocumentsDetailed}
      title="Tài liệu môn học"
      icon={MenuBookIcon}
      onPreview={handleDocumentPreview}
      onDownload={handleDocumentDownload}
      onEdit={handleDocumentEdit}
      onDelete={handleDocumentDelete}
      onTogglePublish={handleDocumentTogglePublish}
      onUpload={handleDocumentUpload}
      searchPlaceholder="Tìm kiếm tài liệu môn học..."
      emptyStateMessage="Chưa có tài liệu nào cho môn học này"
      emptyStateDescription="Hãy tải lên tài liệu đầu tiên cho môn học"
      filterOptions={[
        { value: 'all', label: 'Tất cả loại' },
        { value: 'curriculum', label: 'Giáo trình' },
        { value: 'lecture', label: 'Bài giảng' },
        { value: 'exercise', label: 'Bài tập' },
        { value: 'reference', label: 'Tài liệu tham khảo' },
        { value: 'exam', label: 'Đề thi' }
      ]}
    />
  );

  // Classes Component
//   const ClassesTab = () => {
//     const [selectedSemester, setSelectedSemester] = useState('all');
//     const [searchQuery, setSearchQuery] = useState('');

//     // Get unique semesters
//     const semesters = [...new Set(classes.map(c => c.semester))].sort().reverse();

//     // Filter classes
//     const filteredClasses = classes.filter(classItem => {
//       const matchesSemester = selectedSemester === 'all' || classItem.semester === selectedSemester;
//       const matchesSearch = classItem.classCode.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesSemester && matchesSearch;
//     });

//     return (
//       <Box>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             🏫 Các lớp học của môn ({filteredClasses.length})
//           </Typography>
//           <Button variant="contained" startIcon={<AddIcon />}>
//             Tạo lớp học mới
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Tìm kiếm lớp học..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Học kỳ</InputLabel>
//                 <Select
//                   value={selectedSemester}
//                   label="Học kỳ"
//                   onChange={(e) => setSelectedSemester(e.target.value)}
//                 >
//                   <MenuItem value="all">Tất cả học kỳ</MenuItem>
//                   {semesters.map((semester) => (
//                     <MenuItem key={semester} value={semester}>
//                       Học kỳ {semester}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={5}>
//               <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                 <Button variant="outlined" startIcon={<FilterIcon />} size="small">
//                   Bộ lọc
//                 </Button>
//                 <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
//                   Xuất Excel
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Classes Grid */}
//         {filteredClasses.length > 0 ? (
//           <Grid container spacing={3}>
//             {filteredClasses.map((classItem) => (
//               <Grid item xs={12} md={6} lg={4} key={classItem.id}>
//                 <Card
//                   sx={{
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       elevation: 8,
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
//                     }
//                   }}
//                 >
//                   <CardContent sx={{ flex: 1 }}>
//                     {/* Header */}
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//                       <Box sx={{ flex: 1 }}>
//                         <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
//                           {classItem.classCode}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                           {classItem.semesterName}
//                         </Typography>
//                         <Chip
//                           label={getStatusLabel(classItem.status)}
//                           color={getStatusColor(classItem.status)}
//                           size="small"
//                         />
//                       </Box>
//                       <IconButton size="small">
//                         <MoreVertIcon />
//                       </IconButton>
//                     </Box>

//                     {/* Student Info */}
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                         Sĩ số: {classItem.enrolledStudents}/{classItem.maxStudents} sinh viên
//                       </Typography>
//                       <LinearProgress
//                         variant="determinate"
//                         value={(classItem.enrolledStudents / classItem.maxStudents) * 100}
//                         sx={{ height: 6, borderRadius: 3 }}
//                       />
//                     </Box>

//                     {/* Schedule */}
//                     <Box sx={{ mb: 2 }}>
//                       <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
//                         Lịch học:
//                       </Typography>
//                       {classItem.schedule.map((schedule, index) => (
//                         <Typography key={index} variant="body2" sx={{ fontSize: '0.8rem' }}>
//                           {schedule.day}: {schedule.time} - {schedule.room}
//                         </Typography>
//                       ))}
//                     </Box>

//                     {/* Progress */}
//                     {classItem.status === 'active' && (
//                       <Box sx={{ mb: 2 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                           <Typography variant="caption" color="text.secondary">
//                             Tiến độ
//                           </Typography>
//                           <Typography variant="caption" sx={{ fontWeight: 600 }}>
//                             {classItem.progress}%
//                           </Typography>
//                         </Box>
//                         <LinearProgress
//                           variant="determinate"
//                           value={classItem.progress}
//                           color="secondary"
//                           sx={{ height: 6, borderRadius: 3 }}
//                         />
//                       </Box>
//                     )}

//                     {/* Statistics */}
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Box sx={{ display: 'flex', gap: 2 }}>
//                         <Tooltip title="Điểm trung bình">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                             <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
//                             <Typography variant="caption">
//                               {classItem.avgGrade}
//                             </Typography>
//                           </Box>
//                         </Tooltip>
//                         <Tooltip title="Bài tập">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                             <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                             <Typography variant="caption">
//                               {classItem.assignments}
//                             </Typography>
//                           </Box>
//                         </Tooltip>
//                         <Tooltip title="Thảo luận">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                             <AnnouncementIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
//                             <Typography variant="caption">
//                               {classItem.discussions}
//                             </Typography>
//                           </Box>
//                         </Tooltip>
//                       </Box>
//                     </Box>

//                     {/* Next Class */}
//                     {classItem.nextClass && (
//                       <Alert severity="info" sx={{ mt: 2, py: 0.5 }}>
//                         <Typography variant="caption">
//                           <strong>Buổi học tiếp theo:</strong> {formatDate(classItem.nextClass)}
//                         </Typography>
//                       </Alert>
//                     )}
//                   </CardContent>

//                   <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<VisibilityIcon />}
//                       onClick={() => handleViewClass(classItem)}
//                       sx={{ fontSize: '10px' }}
//                     >
//                       Xem chi tiết
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       startIcon={<PeopleIcon />}
//                       sx={{ fontSize: '10px' }}
//                     >
//                       Sinh viên ({classItem.enrolledStudents})
//                     </Button>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       startIcon={<EditIcon />}
//                       sx={{ fontSize: '10px' }}
//                     >
//                       Quản lý
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 8 }}>
//             <ClassIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//               {searchQuery || selectedSemester !== 'all' ? 'Không tìm thấy lớp học nào' : 'Chưa có lớp học nào'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               {searchQuery || selectedSemester !== 'all'
//                 ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
//                 : 'Hãy tạo lớp học đầu tiên cho môn này'
//               }
//             </Typography>
//             <Button variant="contained" startIcon={<AddIcon />}>
//               Tạo lớp học mới
//             </Button>
//           </Box>
//         )}
//       </Box>
//     );
//   };
    const ClassesTab = () => {
        return (<Classes />);
    }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Không tìm thấy môn học
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/lecturer/courses')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <IconButton onClick={() => navigate('/lecturer/courses')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {course.name}
            </Typography>
            <Chip label={course.code} color="primary" variant="outlined" />
            <Chip label={getStatusLabel(course.status)} color={getStatusColor(course.status)} />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
            {course.englishName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mt: 1 }}>
            {course.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditCourseOpen(true)}>
            Chỉnh sửa
          </Button>
          <Button variant="outlined" startIcon={<SettingsIcon />}>
            Cài đặt
          </Button>
          <Button variant="outlined" startIcon={<Analytics />}>
            Báo cáo
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tổng quan" icon={<Analytics />} iconPosition="start" />
          <Tab label="Thông báo" icon={<AnnouncementIcon />} iconPosition="start" />
          <Tab label="Tài liệu" icon={<FolderIcon />} iconPosition="start" />
          <Tab label="Lớp học" icon={<ClassIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <CourseOverview />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AnnouncementsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <DocumentsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ClassesTab />
      </TabPanel>

      {/* Create Announcement Dialog */}
      <Dialog
        open={createAnnouncementOpen}
        onClose={() => setCreateAnnouncementOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tạo thông báo chung cho môn học</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề thông báo"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Mức độ ưu tiên</InputLabel>
                <Select
                  value={announcementForm.priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                >
                  <MenuItem value="low">Thấp</MenuItem>
                  <MenuItem value="normal">Bình thường</MenuItem>
                  <MenuItem value="high">Cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={announcementForm.sendEmail}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, sendEmail: e.target.checked })}
                  />
                }
                label="Gửi email thông báo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung thông báo"
                multiline
                rows={6}
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                placeholder="Nhập nội dung thông báo cho tất cả lớp học của môn này..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAnnouncementOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleCreateAnnouncement} variant="contained">
            Tạo thông báo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;