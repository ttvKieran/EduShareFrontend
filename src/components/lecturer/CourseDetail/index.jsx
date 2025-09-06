import React, { useState, useEffect, useCallback } from 'react';
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
  Skeleton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  
  Description as DescriptionIcon,
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
  Bolt as BoltIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentList from '../DocumentList';
import DocumentPreview from '../DocumentPreview';
import Notifications from '../CourseNotification';
import API_BASE_URL from '../../../configs/system';
import { Editor } from '@tinymce/tinymce-react';
import Classes from '../Classes';

const CourseDetail = () => {
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  // States
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);

  // Dialog states
  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false);
  const [createAnnouncementLoading, setCreateAnnouncementLoading] = useState(false); // Thêm loading state
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);

  // Notification states - Thêm notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form states - Cập nhật form structure
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'thường', // Đổi từ 'normal' thành 'thường'
    type: 'general', // Thêm type field
    sendEmail: true
  });

  // Form validation - Thêm form validation
  const [formErrors, setFormErrors] = useState({
    title: '',
    content: ''
  });

  // Thêm helper functions
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const validateAnnouncementForm = () => {
    const errors = {};
    
    if (!announcementForm.title.trim()) {
      errors.title = 'Tiêu đề là bắt buộc';
    } else if (announcementForm.title.length > 200) {
      errors.title = 'Tiêu đề không được quá 200 ký tự';
    }

    if (!announcementForm.content.trim()) {
      errors.content = 'Nội dung là bắt buộc';
    } else if (announcementForm.content.length < 10) {
      errors.content = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      priority: 'thường',
      type: 'general',
      sendEmail: true
    });
    setFormErrors({
      title: '',
      content: ''
    });
  };

  // Fetch course data from new API endpoint
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/courses/${courseId}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Course API Response:', result);
        
        if (result.success && result.data) {
          setCourse(result.data);
        } else {
          setError('Không tìm thấy thông tin môn học');
        }
      } else {
        setError('Lỗi khi tải thông tin môn học');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents for this course
  const fetchDocuments = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/documents/course/${courseId}`);
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchDocuments();
    }
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
      case 'active': return 'Đang hoạt động';
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Bản nháp';
      case 'paused': return 'Tạm dừng';
      default: return status || 'Đang hoạt động';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'cao': return 'error';
      case 'thường': return 'primary';
      case 'thấp': return 'default';
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

  // Event handlers - Cập nhật handleCreateAnnouncement
  const handleCreateAnnouncement = async () => {
    // Validate form
    if (!validateAnnouncementForm()) {
      showNotification('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    try {
      setCreateAnnouncementLoading(true);

      // Prepare request body
      const requestBody = {
        title: announcementForm.title.trim(),
        content: announcementForm.content.trim(),
        priority: announcementForm.priority,
        type: announcementForm.type,
        courseId: courseId, // Dùng courseId thay vì classId
        // documentId can be null for general announcements
        documentId: null
      };

      console.log('Creating announcement with data:', requestBody);

      // Call API
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/notifications/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        showNotification('Thông báo đã được tạo thành công!', 'success');
        
        // Close dialog and reset form
        setCreateAnnouncementOpen(false);
        resetAnnouncementForm();
        
        // Refresh announcements list
        // await fetchAnnouncements(); // Uncomment khi có API fetch announcements
        
        // Optional: Send email notification info
        if (announcementForm.sendEmail) {
          showNotification(
            `Thông báo đã được gửi tới sinh viên của môn học`, 
            'info'
          );
        }
      } else {
        // API returned error
        const errorMessage = result.message || 'Có lỗi xảy ra khi tạo thông báo';
        console.error('API Error:', result);
        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      // Network or other errors
      console.error('Error creating announcement:', error);
      showNotification('Không thể kết nối tới server. Vui lòng thử lại.', 'error');
    } finally {
      setCreateAnnouncementLoading(false);
    }
  };

  // Tab Panel Component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Course Overview Component
  const CourseOverview = () => (
    <Grid container spacing={3} sx={{justifyContent: 'space-between'}}>
      {/* Course Info */}
      <Grid item xs={12} md={12} sx={{width: '100%'}}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thông tin môn học
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Mã môn học" 
                      secondary={course.code || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Số tín chỉ" 
                      secondary={`${course.credits || 0} tín chỉ`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Khoa/Bộ môn" 
                      secondary={course.departmentId?.name || 'N/A'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Loại môn học" 
                      secondary={course.courseType || 'N/A'} 
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Sĩ số tối đa" 
                      secondary={`${course.maxStudents || 0} sinh viên`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Môn tiên quyết"
                      secondary={
                        course.prerequisites && course.prerequisites.length > 0 
                          ? course.prerequisites.map(prereq => prereq.code).join(', ')
                          : 'Không có'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Trạng thái" 
                      secondary={
                        <Chip 
                          label={getStatusLabel('active')} 
                          color={getStatusColor('active')} 
                          size="small" 
                        />
                      } 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Cập nhật cuối" 
                      secondary={formatDate(course.updatedAt)} 
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={8} md={8} sx={{minWidth: '800px', width: '60%'}}>
        {/* Course Description */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Mô tả môn học
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {course.description || 'Chưa có mô tả cho môn học này.'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Course Actions */}
      <Grid item xs={4} md={4} sx={{minWidth: '300px'}}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BoltIcon sx={{ mr: 1, color: 'secondary.main' }} />
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
                startIcon={<UploadIcon />}
                // onClick={() => setUploadDocumentOpen(true)}
                onClick={() => setTabValue(2)}
              >
                Tải tài liệu
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ClassIcon />}
                onClick={() => navigate(`/lecturer/classes`)}
              >
                Xem lớp học
              </Button>
              {/* <Button
                variant="outlined"
                fullWidth
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate(`/lecturer/reports/course/${courseId}`)}
              >
                Xem báo cáo
              </Button> */}
            </Stack>
          </CardContent>
        </Card>

        {/* Course Statistics */}
        {/* <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thống kê
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                    {course.classIds?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lớp học
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                    {course.documentIds?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tài liệu
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  );

  // Announcements Component (keep existing)
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
      <Notifications courseId={courseId}/>
    </Box>
  );

  // Documents Component
  const DocumentsTab = () => {
    // Transform API data to match DocumentList component format
    const transformedDocuments = documents.map(doc => ({
      _id: doc._id,
      title: doc.title,
      description: doc.description,
      type: doc.type,
      mimeType: doc.mimeType,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      viewCount: doc.viewCount,
      downloadCount: doc.downloadCount,
      authors: doc.authors,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      category: doc.type,
      isPublished: doc.status === 'active',
      tags: doc.tags || [],
      downloadUrl: doc.downloadUrl,
      previewUrl: doc.previewUrl,
      allowDownload: doc.allowDownload
    }));

    const handleDocumentPreview = (document) => {
      console.log('Preview document:', document);
      if (document.previewUrl) {
        window.open(document.previewUrl, '_blank');
      }
    };

    const handleDocumentDownload = (document) => {
      console.log('Download document:', document);
      if (document.downloadUrl) {
        window.open(document.downloadUrl, '_blank');
      }
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

    return (
      <DocumentList
        documents={transformedDocuments}
        title="Tài liệu môn học"
        icon={MenuBookIcon}
        courseId={courseId}
        onPreview={handleDocumentPreview}
        onDownload={handleDocumentDownload}
        onEdit={handleDocumentEdit}
        onDelete={handleDocumentDelete}
        onTogglePublish={handleDocumentTogglePublish}
        onUpload={handleDocumentUpload}
        onRefresh={fetchDocuments}
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
  };

  // Classes Tab - navigate to classes page
  // const ClassesTab = () => (
  //   <Box sx={{ textAlign: 'center', py: 8 }}>
  //     <ClassIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
  //     <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
  //       Quản lý lớp học
  //     </Typography>
  //     <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
  //       Xem và quản lý các lớp học của môn {course?.name}
  //     </Typography>
  //     <Button
  //       variant="contained"
  //       startIcon={<ClassIcon />}
  //       onClick={() => navigate('/lecturer/classes')}
  //       size="large"
  //     >
  //       Xem danh sách lớp học
  //     </Button>
  //   </Box>
  // );
  const ClassesTab = () => {
    return (<Classes />);
  }

  // Loading state
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

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/lecturer/courses')}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchCourseData}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  // Course not found
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
            <Chip 
              label={course.code} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={course.courseType} 
              color="#10B982" 
              variant="outlined" 
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
            {course.departmentId?.name} • {course.credits} tín chỉ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <Button 
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
          </Button> */}
          {/* <Button 
            variant="outlined" 
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate(`/lecturer/reports/course/${courseId}`)}
          >
            Báo cáo
          </Button> */}
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

      {/* Create Announcement Dialog - Cập nhật toàn bộ dialog */}
      <Dialog
        open={createAnnouncementOpen}
        onClose={() => {
          if (!createAnnouncementLoading) {
            setCreateAnnouncementOpen(false);
            resetAnnouncementForm();
          }
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnnouncementIcon />
            Tạo thông báo mới
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề thông báo"
                placeholder="Nhập tiêu đề thông báo..."
                value={announcementForm.title}
                onChange={(e) => {
                  setAnnouncementForm({ ...announcementForm, title: e.target.value });
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: '' });
                  }
                }}
                required
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={createAnnouncementLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Mức độ ưu tiên</InputLabel>
                <Select
                  value={announcementForm.priority}
                  label="Mức độ ưu tiên"
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                  disabled={createAnnouncementLoading}
                >
                  <MenuItem value="thấp">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="THẤP" size="small" color="default" />
                    </Box>
                  </MenuItem>
                  <MenuItem value="thường">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="BÌNH THƯỜNG" size="small" color="primary" />
                    </Box>
                  </MenuItem>
                  <MenuItem value="cao">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="CAO" size="small" color="error" />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại thông báo</InputLabel>
                <Select
                  value={announcementForm.type}
                  label="Loại thông báo"
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                  disabled={createAnnouncementLoading}
                >
                  <MenuItem value="general">Thông báo chung</MenuItem>
                  <MenuItem value="assignment">Bài tập</MenuItem>
                  <MenuItem value="exam">Thi cử</MenuItem>
                  <MenuItem value="document">Tài liệu</MenuItem>
                  <MenuItem value="schedule">Lịch học</MenuItem>
                  <MenuItem value="urgent">Khẩn cấp</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={announcementForm.sendEmail}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, sendEmail: e.target.checked })}
                      color="primary"
                      disabled={createAnnouncementLoading}
                    />
                  }
                  label="Gửi email thông báo cho sinh viên"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nội dung thông báo *
              </Typography>
              {formErrors.content && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.content}
                </Alert>
              )}
              <Box sx={{ border: 0, width: '100%' }}>
                <Editor
                  apiKey="2knowjdoqtj7pi51xfq4e0b9t6b82xiggwnfl5qvuimfnztf"
                  value={announcementForm.content}
                  onEditorChange={(content) => {
                    setAnnouncementForm({ ...announcementForm, content });
                    if (formErrors.content) {
                      setFormErrors({ ...formErrors, content: '' });
                    }
                  }}
                  disabled={createAnnouncementLoading}
                  init={{
                    height: 400,
                    width: 850,
                    menubar: true,
                    border: 0,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
                      'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking',
                      'textcolor', 'colorpicker'
                    ],
                    toolbar: [
                      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
                      'forecolor backcolor | align lineheight | numlist bullist outdent indent',
                      'link image media table | emoticons charmap hr pagebreak',
                      'searchreplace visualblocks code fullscreen preview help'
                    ].join(' | '),
                    content_style: `
                      body { 
                        font-family: 'Roboto', Arial, sans-serif; 
                        font-size: 14px; 
                        line-height: 1.6;
                        color: #333;
                        padding: 10px;
                      }
                    `,
                    language: 'vi',
                    readonly: createAnnouncementLoading,
                    setup: function (editor) {
                      editor.on('init', function () {
                        editor.getContainer().style.transition = "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
                      });
                      editor.on('focus', function () {
                        if (!createAnnouncementLoading) {
                          editor.getContainer().style.borderColor = '#1976d2';
                          editor.getContainer().style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
                        }
                      });
                      editor.on('blur', function () {
                        editor.getContainer().style.borderColor = '#ddd';
                        editor.getContainer().style.boxShadow = 'none';
                      });
                    }
                  }}
                />
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
              {announcementForm.sendEmail && (
                <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                  📧 Thông báo sẽ được gửi tới sinh viên của môn học
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => {
                  setCreateAnnouncementOpen(false);
                  resetAnnouncementForm();
                }}
                variant="outlined"
                startIcon={<CloseIcon />}
                disabled={createAnnouncementLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                variant="contained"
                startIcon={createAnnouncementLoading ? <CircularProgress size={16} /> : <SendIcon />}
                disabled={createAnnouncementLoading || !announcementForm.title.trim() || !announcementForm.content.trim()}
              >
                {createAnnouncementLoading ? 'Đang tạo...' : 'Đăng thông báo'}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar - Thêm notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDetail;