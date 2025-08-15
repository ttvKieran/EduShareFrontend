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
  Fab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  TablePagination,
  Checkbox,
  Breadcrumbs,
  Link,
  AvatarGroup,
  Rating,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Skeleton
} from '@mui/material';
import {
  Description,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Schedule,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Grade as GradeIcon,
  Group as GroupIcon,
  Book as BookIcon,
  Quiz as QuizIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Class as ClassIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  VideoLibrary as VideoIcon,
  InsertDriveFile as FileIcon,
  Link as LinkIcon,
  MenuBook as MenuBookIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Forum as ForumIcon,
  Announcement as AnnouncementIcon,
  Event as EventIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  Refresh as RefreshIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentList from '../DocumentList';
import DocumentPreview from '../DocumentPreview';
import Notifications from '../ClassNotification';

const CourseDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  // States
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);

  // Dialog states
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);

  // Form states
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    sendEmail: true
  });

  // Mock data
  const mockCourse = {
    id: parseInt(courseId),
    name: 'Lập trình hướng đối tượng',
    code: 'IT3103',
    description: 'Môn học giới thiệu các khái niệm cơ bản về lập trình hướng đối tượng sử dụng ngôn ngữ Java. Sinh viên sẽ học về class, object, inheritance, polymorphism, encapsulation và abstraction.',
    semester: '2024.1',
    semesterName: 'Học kỳ I năm 2024-2025',
    credits: 3,
    maxStudents: 50,
    enrolledStudents: 42,
    status: 'active',
    progress: 65,
    assignments: 8,
    documents: 15,
    discussions: 12,
    announcements: 5,
    lastUpdated: '2024-08-10T10:30:00Z',
    schedule: [
      { day: 'Thứ 2', time: '08:00-09:30', room: 'Lab A2', type: 'Lý thuyết' },
      { day: 'Thứ 4', time: '08:00-09:30', room: 'Lab A2', type: 'Thực hành' }
    ],
    avgGrade: 7.8,
    completedLessons: 13,
    totalLessons: 20,
    nextClass: '2024-08-15T08:00:00Z',
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

  const mockAnnouncements = [
    {
      id: 1,
      title: 'Thông báo về bài tập lớn cuối kỳ',
      content: 'Các em chuẩn bị bài tập lớn theo nhóm 3-4 người. Đề tài sẽ được công bố vào tuần tới.',
      priority: 'high',
      createdAt: '2024-08-10T10:30:00Z',
      updatedAt: '2024-08-10T10:30:00Z',
      pinned: true,
      views: 38,
      comments: 5
    },
    {
      id: 2,
      title: 'Thay đổi lịch học tuần sau',
      content: 'Do giảng viên có công tác, buổi học thứ 4 sẽ chuyển sang thứ 6 cùng giờ.',
      priority: 'normal',
      createdAt: '2024-08-08T14:20:00Z',
      updatedAt: '2024-08-08T14:20:00Z',
      pinned: false,
      views: 42,
      comments: 2
    }
  ];

  const mockAssignments = [
    {
      id: 1,
      title: 'Bài tập 1: Class và Object',
      description: 'Viết chương trình quản lý sinh viên sử dụng class và object',
      dueDate: '2024-08-20T23:59:00Z',
      type: 'homework',
      status: 'published',
      maxScore: 10,
      submissions: 35,
      graded: 28,
      avgScore: 8.2,
      createdAt: '2024-08-05T09:00:00Z'
    },
    {
      id: 2,
      title: 'Lab 2: Inheritance',
      description: 'Thực hành về kế thừa trong Java',
      dueDate: '2024-08-25T23:59:00Z',
      type: 'lab',
      status: 'published',
      maxScore: 15,
      submissions: 30,
      graded: 15,
      avgScore: 7.8,
      createdAt: '2024-08-08T10:00:00Z'
    },
    {
      id: 3,
      title: 'Quiz 1: OOP Concepts',
      description: 'Kiểm tra nhanh về các khái niệm OOP cơ bản',
      dueDate: '2024-08-18T15:30:00Z',
      type: 'quiz',
      status: 'draft',
      maxScore: 5,
      submissions: 0,
      graded: 0,
      avgScore: 0,
      createdAt: '2024-08-12T11:00:00Z'
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Slide Bài 1 - Giới thiệu Java',
      type: 'presentation',
      size: '2.5 MB',
      downloadCount: 42,
      uploadedAt: '2024-08-01T09:00:00Z',
      category: 'lecture'
    },
    {
      id: 2,
      name: 'Hướng dẫn cài đặt Eclipse IDE',
      type: 'document',
      size: '1.8 MB',
      downloadCount: 38,
      uploadedAt: '2024-08-01T10:30:00Z',
      category: 'guide'
    },
    {
      id: 3,
      name: 'Video bài giảng - OOP Concepts',
      type: 'video',
      size: '125 MB',
      downloadCount: 25,
      uploadedAt: '2024-08-05T14:00:00Z',
      category: 'lecture'
    }
  ];

  const mockDiscussions = [
    {
      id: 1,
      title: 'Thắc mắc về Inheritance',
      content: 'Em chưa hiểu rõ về super keyword, thầy có thể giải thích thêm không ạ?',
      author: {
        name: 'Nguyễn Văn A',
        avatar: '/api/placeholder/30/30',
        role: 'student'
      },
      replies: 3,
      views: 15,
      createdAt: '2024-08-10T16:20:00Z',
      lastReply: '2024-08-10T18:30:00Z',
      tags: ['inheritance', 'java'],
      solved: false
    },
    {
      id: 2,
      title: 'Lỗi khi compile code Java',
      content: 'Code em bị lỗi "cannot find symbol", em không biết sửa như thế nào',
      author: {
        name: 'Trần Thị B',
        avatar: '/api/placeholder/30/30',
        role: 'student'
      },
      replies: 2,
      views: 12,
      createdAt: '2024-08-09T14:15:00Z',
      lastReply: '2024-08-09T15:45:00Z',
      tags: ['debug', 'compile-error'],
      solved: true
    }
  ];

  const mockActivities = [
    {
      id: 1,
      type: 'assignment_submitted',
      content: 'Nguyễn Văn A đã nộp bài tập "Class và Object"',
      timestamp: '2024-08-12T14:30:00Z',
      user: { name: 'Nguyễn Văn A', avatar: '/api/placeholder/30/30' }
    },
    {
      id: 2,
      type: 'document_uploaded',
      content: 'Giảng viên đã tải lên tài liệu "Slide Bài 2"',
      timestamp: '2024-08-12T10:15:00Z',
      user: { name: 'TS. Nguyễn Văn Minh', avatar: '/api/placeholder/30/30' }
    },
    {
      id: 3,
      type: 'discussion_created',
      content: 'Trần Thị B đã tạo thảo luận mới "Thắc mắc về Interface"',
      timestamp: '2024-08-11T16:45:00Z',
      user: { name: 'Trần Thị B', avatar: '/api/placeholder/30/30' }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourse(mockCourse);
      setAnnouncements(mockAnnouncements);
      setAssignments(mockAssignments);
      setDocuments(mockDocuments);
      setDiscussions(mockDiscussions);
      setActivities(mockActivities);
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

  const getAssignmentTypeIcon = (type) => {
    switch (type) {
      case 'homework': return <AssignmentIcon />;
      case 'lab': return <SchoolIcon />;
      case 'quiz': return <QuizIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'presentation': return <FileIcon />;
      case 'document': return <FileIcon />;
      case 'video': return <VideoIcon />;
      default: return <FileIcon />;
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

  const formatFileSize = (size) => {
    return size;
  };

  // Event handlers
  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', announcementForm);
    setCreateAnnouncementOpen(false);
    setAnnouncementForm({ title: '', content: '', priority: 'normal', sendEmail: true });
  };

  // Tab Panel Component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Course Overview Component
  const CourseOverview = () => (
    // <Card>
      <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'start'}}>
        {/* Course Stats */}
        <Grid item sx={{ width: '100%' }}>
          <Card sx={{border: 0}}>
            <CardContent sx={{border: 0}}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Mã môn học"
                    secondary={course.code}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Số tín chỉ"
                    secondary={`${course.credits} tín chỉ`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Học kỳ"
                    secondary={course.semesterName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Sĩ số"
                    secondary={`${course.enrolledStudents}/${course.maxStudents} sinh viên`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Trạng thái"
                    secondary={
                      <Chip
                        label={getStatusLabel(course.status)}
                        color={getStatusColor(course.status)}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4} sx={{width: '76%'}}>
          {/* Schedule */}
          <Card sx={{border: 0}}>
            <CardContent sx={{border: 0}}>
              <List>
                {course.schedule.map((schedule, index) => (
                  <ListItem key={index} divider={index < course.schedule.length - 1}>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${schedule.day}: ${schedule.time}`}
                      secondary={`${schedule.room} - ${schedule.type}`}
                    />
                  </ListItem>
                ))}
              </List>
              {course.nextClass && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Buổi học tiếp theo:</strong> {formatDate(course.nextClass)}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4} sx={{border: 0, height: '24%'}}>
          {/* Quick Actions */}
          <Card sx={{border: 0}}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                <BoltIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thao tác nhanh
                </Typography>
              </Box>
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
                  startIcon={<AssignmentIcon />}
                  onClick={() => setCreateAssignmentOpen(true)}
                >
                  Tạo bài tập
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<UploadIcon />}
                  onClick={() => setUploadDocumentOpen(true)}
                >
                  Tải tài liệu
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PeopleIcon />}
                  onClick={() => setTabValue(4)}
                >
                  Quản lý sinh viên
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    // </Card>

  );

  // Announcements Component
  const AnnouncementsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thông báo
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateAnnouncementOpen(true)}
        >
          Tạo thông báo
        </Button>
      </Box>

      {/* <Stack spacing={2}>
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
      </Stack> */}
      <Notifications />
    </Box>
  );

  // Assignments Component
  // const AssignmentsTab = () => (
  //   <Box>
  //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  //       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
  //         <AssignmentIcon sx={{ mr: 1 }} />
  //         <Typography variant="h6" sx={{ fontWeight: 600 }}>
  //           Bài tập & Kiểm tra
  //         </Typography>
  //       </Box>
  //       <Button
  //         variant="contained"
  //         startIcon={<AddIcon />}
  //         onClick={() => setCreateAssignmentOpen(true)}
  //       >
  //         Tạo bài tập
  //       </Button>
  //     </Box>

  //     <Grid container spacing={3}>
  //       {assignments.map((assignment) => (
  //         <Grid item xs={12} md={6} lg={4} key={assignment.id}>
  //           <Card>
  //             <CardContent>
  //               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
  //                 {getAssignmentTypeIcon(assignment.type)}
  //                 <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
  //                   {assignment.title}
  //                 </Typography>
  //                 <Chip
  //                   label={assignment.status}
  //                   size="small"
  //                   color={assignment.status === 'published' ? 'success' : 'default'}
  //                 />
  //               </Box>

  //               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
  //                 {assignment.description}
  //               </Typography>

  //               <Box sx={{ mb: 2 }}>
  //                 <Typography variant="caption" color="text.secondary">
  //                   Hạn nộp: {formatDate(assignment.dueDate)}
  //                 </Typography>
  //               </Box>

  //               <Grid container spacing={2} sx={{ mb: 2 }}>
  //                 <Grid item xs={6}>
  //                   <Typography variant="caption" color="text.secondary">
  //                     Đã nộp: {assignment.submissions}/{course.enrolledStudents}
  //                   </Typography>
  //                   <LinearProgress
  //                     variant="determinate"
  //                     value={(assignment.submissions / course.enrolledStudents) * 100}
  //                     size="small"
  //                   />
  //                 </Grid>
  //                 <Grid item xs={6}>
  //                   <Typography variant="caption" color="text.secondary">
  //                     Đã chấm: {assignment.graded}/{assignment.submissions}
  //                   </Typography>
  //                   <LinearProgress
  //                     variant="determinate"
  //                     value={assignment.submissions > 0 ? (assignment.graded / assignment.submissions) * 100 : 0}
  //                     color="secondary"
  //                     size="small"
  //                   />
  //                 </Grid>
  //               </Grid>

  //               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
  //                   Điểm TB: {assignment.avgScore || '--'}/{assignment.maxScore}
  //                 </Typography>
  //                 <Box>
  //                   <IconButton size="small" color="primary">
  //                     <EditIcon />
  //                   </IconButton>
  //                   <IconButton size="small" color="primary">
  //                     <VisibilityIcon />
  //                   </IconButton>
  //                 </Box>
  //               </Box>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       ))}
  //     </Grid>
  //   </Box>
  // );

  // Documents Component - Updated to match student DocumentCard style
  const mockDocumentsDetailed = [
    {
      _id: '1',
      title: 'Slide Bài 1 - Giới thiệu Java và OOP',
      description: 'Tài liệu giới thiệu về ngôn ngữ lập trình Java và các khái niệm cơ bản về lập trình hướng đối tượng',
      type: 'lecture',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 2621440,
      viewCount: 42,
      downloadCount: 35,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-08-01T09:00:00Z',
      updatedAt: '2024-08-01T09:00:00Z',
      category: 'lecture',
      isPublished: true,
      tags: ['java', 'oop', 'introduction']
    },
    {
      _id: '2',
      title: 'Hướng dẫn cài đặt Eclipse IDE',
      description: 'Tài liệu hướng dẫn chi tiết cách cài đặt và cấu hình Eclipse IDE cho lập trình Java',
      type: 'reference',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileType: 'docx',
      fileSize: 1887436,
      viewCount: 38,
      downloadCount: 32,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-08-01T10:30:00Z',
      updatedAt: '2024-08-01T10:30:00Z',
      category: 'guide',
      isPublished: true,
      tags: ['eclipse', 'ide', 'setup']
    },
    {
      _id: '3',
      title: 'Video bài giảng - OOP Concepts',
      description: 'Video bài giảng chi tiết về các khái niệm cơ bản trong lập trình hướng đối tượng',
      type: 'lecture',
      mimeType: 'video/mp4',
      fileType: 'mp4',
      fileSize: 131072000,
      viewCount: 25,
      downloadCount: 15,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-08-05T14:00:00Z',
      updatedAt: '2024-08-05T14:00:00Z',
      category: 'lecture',
      isPublished: true,
      tags: ['video', 'oop', 'concepts']
    },
    {
      _id: '4',
      title: 'Bài tập thực hành Inheritance',
      description: 'Bộ bài tập thực hành về kế thừa trong Java với các ví dụ cụ thể',
      type: 'exercise',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 1048576,
      viewCount: 30,
      downloadCount: 28,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-08-08T11:00:00Z',
      updatedAt: '2024-08-08T11:00:00Z',
      category: 'exercise',
      isPublished: false,
      tags: ['inheritance', 'practice', 'java']
    },
    {
      _id: '5',
      title: 'Đề thi giữa kỳ 2023',
      description: 'Đề thi giữa kỳ môn Lập trình hướng đối tượng năm 2023 để tham khảo',
      type: 'exam',
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: 524288,
      viewCount: 15,
      downloadCount: 12,
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: '2024-08-10T16:00:00Z',
      updatedAt: '2024-08-10T16:00:00Z',
      category: 'exam',
      isPublished: true,
      tags: ['exam', 'midterm', 'reference']
    },
    // Add more mock documents to test pagination
    ...Array.from({ length: 15 }, (_, index) => ({
      _id: `${index + 6}`,
      title: `Tài liệu mẫu ${index + 1}`,
      description: `Mô tả cho tài liệu mẫu số ${index + 1}`,
      type: ['lecture', 'exercise', 'reference', 'exam'][index % 4],
      mimeType: 'application/pdf',
      fileType: 'pdf',
      fileSize: Math.floor(Math.random() * 10000000) + 500000,
      viewCount: Math.floor(Math.random() * 100),
      downloadCount: Math.floor(Math.random() * 50),
      authors: [{ name: 'TS. Nguyễn Văn Minh' }],
      createdAt: new Date(2024, 7, Math.floor(Math.random() * 30) + 1).toISOString(),
      updatedAt: new Date(2024, 7, Math.floor(Math.random() * 30) + 1).toISOString(),
      category: 'lecture',
      isPublished: Math.random() > 0.3,
      tags: ['tag1', 'tag2', 'tag3']
    }))
  ];

  // Event handlers for documents
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
    // Implement delete logic here
  };

  const handleDocumentTogglePublish = (document) => {
    console.log('Toggle publish:', document);
    // Implement publish/unpublish logic here
  };

  const handleDocumentUpload = () => {
    setUploadDocumentOpen(true);
  };
  const DocumentsTab = () => (
    <DocumentList
      documents={mockDocumentsDetailed}
      title="Tài liệu học tập"
      icon={MenuBookIcon}
      onPreview={handleDocumentPreview}
      onDownload={handleDocumentDownload}
      onEdit={handleDocumentEdit}
      onDelete={handleDocumentDelete}
      onTogglePublish={handleDocumentTogglePublish}
      onUpload={handleDocumentUpload}
      searchPlaceholder="Tìm kiếm tài liệu trong môn học..."
      emptyStateMessage="Chưa có tài liệu nào trong môn học này"
      emptyStateDescription="Hãy tải lên tài liệu đầu tiên cho môn học này"
    />
  );

  // Discussions Component
  const DiscussionsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ForumIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Thảo luận</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Tạo thảo luận
        </Button>
      </Box>

      <Stack spacing={2}>
        {discussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar src={discussion.author.avatar}>
                  {discussion.author.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {discussion.title}
                    </Typography>
                    {discussion.solved && (
                      <Chip label="Đã giải quyết" size="small" color="success" />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {discussion.content}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {discussion.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      bởi {discussion.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(discussion.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      💬 {discussion.replies} trả lời
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      👁 {discussion.views} lượt xem
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  // Students Component
  // ...existing code...

  // Students Component - Updated to display in tab instead of dialog
  const StudentsTab = () => {
    // States for students management
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Mock students data
    const mockStudents = [
      {
        id: 1,
        studentCode: 'B22DCCN001',
        fullName: 'Nguyễn Văn An',
        email: 'an.nv@university.edu.vn',
        birthDate: '15/03/2004',
        className: 'D22CNPM03',
        averageGrade: 8.5,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 2,
        studentCode: 'B22DCCN002',
        fullName: 'Trần Thị Bình',
        email: 'binh.tt@university.edu.vn',
        birthDate: '22/07/2004',
        className: 'D22CNPM03',
        averageGrade: 9.0,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 3,
        studentCode: 'B22DCCN003',
        fullName: 'Lê Minh Cường',
        email: 'cuong.lm@university.edu.vn',
        birthDate: '10/11/2004',
        className: 'D22CNPM01',
        averageGrade: 7.8,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 4,
        studentCode: 'B22DCCN004',
        fullName: 'Phạm Thu Dung',
        email: 'dung.pt@university.edu.vn',
        birthDate: '28/09/2004',
        className: 'D22CNPM02',
        averageGrade: 8.2,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 5,
        studentCode: 'B22DCCN005',
        fullName: 'Hoàng Văn Em',
        email: 'em.hv@university.edu.vn',
        birthDate: '05/12/2004',
        className: 'D22CNPM03',
        averageGrade: 7.5,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 6,
        studentCode: 'B22DCCN006',
        fullName: 'Đỗ Thị Hoa',
        email: 'hoa.dt@university.edu.vn',
        birthDate: '18/02/2004',
        className: 'D22CNPM01',
        averageGrade: 8.8,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 7,
        studentCode: 'B22DCCN007',
        fullName: 'Vũ Minh Khang',
        email: 'khang.vm@university.edu.vn',
        birthDate: '14/06/2004',
        className: 'D22CNPM02',
        averageGrade: 8.0,
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 8,
        studentCode: 'B22DCCN008',
        fullName: 'Ngô Thị Lan',
        email: 'lan.nt@university.edu.vn',
        birthDate: '30/08/2004',
        className: 'D22CNPM03',
        averageGrade: 9.2,
        avatar: '/api/placeholder/40/40'
      }
    ];

    // Initialize students data
    useEffect(() => {
      setStudentsLoading(true);
      setTimeout(() => {
        setStudents(mockStudents);
        setStudentsLoading(false);
      }, 500);
    }, []);

    // Filter students based on search query
    const getFilteredStudents = () => {
      return students.filter(student =>
        student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.className.toLowerCase().includes(studentSearchQuery.toLowerCase())
      );
    };

    // Event handlers
    const handleSearchStudent = (event) => {
      setStudentSearchQuery(event.target.value);
      setPage(0); // Reset to first page when searching
    };

    const handleSelectStudent = (event, studentId) => {
      event.stopPropagation();
      const selectedIndex = selectedStudents.indexOf(studentId);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedStudents, studentId);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedStudents.slice(1));
      } else if (selectedIndex === selectedStudents.length - 1) {
        newSelected = newSelected.concat(selectedStudents.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedStudents.slice(0, selectedIndex),
          selectedStudents.slice(selectedIndex + 1),
        );
      }
      setSelectedStudents(newSelected);
    };

    const handleSelectAllStudents = (event) => {
      if (event.target.checked) {
        const newSelecteds = getFilteredStudents().map((student) => student.id);
        setSelectedStudents(newSelecteds);
        return;
      }
      setSelectedStudents([]);
    };

    const isStudentSelected = (studentId) => selectedStudents.indexOf(studentId) !== -1;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const filteredStudents = getFilteredStudents();
    const numSelected = selectedStudents.length;
    const rowCount = filteredStudents.length;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PeopleIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sinh viên ({filteredStudents.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<PersonAddIcon />}>
              Thêm sinh viên
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Xuất danh sách
            </Button>
          </Box>
        </Box>

        {/* Toolbar */}
        <Paper sx={{ mb: 2 }}>
          <Box sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Tìm kiếm sinh viên..."
                value={studentSearchQuery}
                onChange={handleSearchStudent}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <Typography variant="body2" color="text.secondary">
                Tổng: {filteredStudents.length} sinh viên
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                size="small"
                disabled={numSelected === 0}
              >
                Gửi email ({numSelected})
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                size="small"
              >
                In danh sách
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600
                    }}
                  >
                    <Checkbox
                      color="default"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllStudents}
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 80
                    }}
                  >
                    STT
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    MSV
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 200
                    }}
                  >
                    Họ và tên
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 200
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 120
                    }}
                  >
                    Ngày sinh
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 120
                    }}
                  >
                    Lớp
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 100
                    }}
                  >
                    Điểm TB
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 120
                    }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Đang tải danh sách sinh viên...</Typography>
                      <LinearProgress sx={{ mt: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {studentSearchQuery ? 'Không tìm thấy sinh viên nào' : 'Chưa có sinh viên nào'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {studentSearchQuery
                          ? 'Thử thay đổi từ khóa tìm kiếm'
                          : 'Hãy thêm sinh viên đầu tiên vào môn học này'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student, index) => {
                      const isItemSelected = isStudentSelected(student.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleSelectStudent(event, student.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={student.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            sx={{ textAlign: 'center', fontWeight: 600 }}
                          >
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {student.studentCode}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={student.avatar}
                                sx={{ width: 40, height: 40 }}
                              >
                                {student.fullName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {student.fullName}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {student.email}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                              {student.birthDate}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Chip
                              label={student.className}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {student.averageGrade}
                              </Typography>
                              <Chip
                                label={student.averageGrade >= 8.5 ? 'Giỏi' : student.averageGrade >= 7.0 ? 'Khá' : 'TB'}
                                size="small"
                                color={student.averageGrade >= 8.5 ? 'success' : student.averageGrade >= 7.0 ? 'warning' : 'default'}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('View student details:', student);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Gửi email">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Send email to:', student);
                                }}
                              >
                                <EmailIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa khỏi lớp">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Bạn có chắc muốn xóa ${student.fullName} khỏi lớp?`)) {
                                    console.log('Remove student:', student);
                                  }
                                }}
                              >
                                <PersonRemoveIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50'
            }}
          />
        </Paper>

        {/* Selected Actions */}
        {numSelected > 0 && (
          <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Đã chọn {numSelected} sinh viên
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => console.log('Send email to selected students')}
                >
                  Gửi email hàng loạt
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => console.log('Export selected students')}
                >
                  Xuất danh sách
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<PersonRemoveIcon />}
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc muốn xóa ${numSelected} sinh viên đã chọn?`)) {
                      console.log('Remove selected students');
                    }
                  }}
                >
                  Xóa khỏi lớp
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    );
  };

  // ...rest of existing code...

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="70%" height={300} />
          <Skeleton variant="rectangular" width="30%" height={300} />
        </Box>
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
          onClick={() => navigate('/lecturer/classes')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <IconButton onClick={() => navigate('/lecturer/classes')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {course.name}
            </Typography>
            <Chip
              label={course.code}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={getStatusLabel(course.status)}
              color={getStatusColor(course.status)}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
            {course.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditCourseOpen(true)}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
          >
            Cài đặt
          </Button>
          <Button
            variant="outlined"
            startIcon={<AnalyticsIcon />}
          >
            Báo cáo
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 0.5 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tổng quan" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Thông báo" icon={<AnnouncementIcon />} iconPosition="start" />
          {/* <Tab label="Bài tập" icon={<AssignmentIcon />} iconPosition="start" /> */}
          <Tab label="Tài liệu" icon={<FolderIcon />} iconPosition="start" />
          <Tab label="Thảo luận" icon={<ForumIcon />} iconPosition="start" />
          <Tab label="Sinh viên" icon={<PeopleIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <CourseOverview />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AnnouncementsTab />
      </TabPanel>

      {/* <TabPanel value={tabValue} index={2}>
        <AssignmentsTab />
      </TabPanel> */}

      <TabPanel value={tabValue} index={2}>
        <DocumentsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <DiscussionsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <StudentsTab />
      </TabPanel>

      {/* Create Announcement Dialog */}
      <Dialog
        open={createAnnouncementOpen}
        onClose={() => setCreateAnnouncementOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tạo thông báo mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
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
          </Grid>
          {/* <Grid item xs={12}> */}
              <TextField
                fullWidth
                label="Nội dung"
                multiline
                rows={6}
                sx={{mt: 2}}
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              />
            {/* </Grid> */}
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

      {/* Other dialogs can be added similarly */}
    </Box>
  );
};

export default CourseDetail;