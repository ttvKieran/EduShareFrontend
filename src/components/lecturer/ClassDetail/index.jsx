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
import * as XLSX from 'xlsx';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import DocumentList from '../DocumentList';
import DocumentPreview from '../DocumentPreview';
import Notifications from '../ClassNotification';
import API_BASE_URL from '../../../configs/system';

import { Editor } from '@tinymce/tinymce-react';

const CourseDetail = () => {
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { classId } = useParams();
  const courseId = classId;

  // States
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
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

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/classes/`);
      
      if (response.ok) {
        const data = await response.json();
        const foundCourse = data.data.find(c => c._id === courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          setStudents(foundCourse.studentIds || []);
        } else {
          console.error('Course not found');
        }
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/notifications/class/${courseId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data || []);
      } else {
        console.error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/lecturer/documents/class/${courseId}`);
      
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

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchAnnouncements();
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
      case 'active': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Bản nháp';
      case 'paused': return 'Tạm dừng';
      default: return status;
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

  const getDayOfWeekText = (dayOfWeek) => {
    const days = {
      1: 'Chủ nhật',
      2: 'Thứ 2',
      3: 'Thứ 3',
      4: 'Thứ 4',
      5: 'Thứ 5',
      6: 'Thứ 6',
      7: 'Thứ 7'
    };
    return days[dayOfWeek] || 'Không xác định';
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Event handlers
  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', announcementForm);
    setCreateAnnouncementOpen(false);
    setAnnouncementForm({ title: '', content: '', priority: 'normal', sendEmail: true });
    // Refresh announcements after creating
    fetchAnnouncements();
  };

  // Tab Panel Component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Course Overview Component
  const CourseOverview = () => (
    <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'start' }}>
      {/* Course Stats */}
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ border: 0 }}>
          <CardContent sx={{ border: 0 }}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Mã môn học"
                  secondary={course.courseId?.code || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Số tín chỉ"
                  secondary={`${course.courseId?.credits || 0} tín chỉ`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Học kỳ"
                  secondary={`Học kỳ ${course.semester} năm ${course.academicYear}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sĩ số"
                  secondary={`${course.studentIds?.length || 0}/${course.courseId?.maxStudents || 0} sinh viên`}
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

      <Grid item xs={4} sx={{ width: '76%' }}>
        {/* Schedule */}
        <Card sx={{ border: 0 }}>
          <CardContent sx={{ border: 0 }}>
            <List>
              {course.schedule?.map((schedule, index) => (
                <ListItem key={index} divider={index < course.schedule.length - 1}>
                  <ListItemIcon>
                    <ScheduleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${getDayOfWeekText(schedule.dayOfWeek)}: ${schedule.timeStart}-${schedule.timeEnd}`}
                    secondary={`${schedule.classroom}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4} sx={{ border: 0, height: '24%' }}>
        {/* Quick Actions */}
        <Card sx={{ border: 0 }}>
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
              {/* <Button
                variant="outlined"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => setCreateAssignmentOpen(true)}
              >
                Tạo bài tập
              </Button> */}
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
                onClick={() => setTabValue(3)}
              >
                Quản lý sinh viên
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
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
          <Notifications classId={courseId}/>
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
      previewUrl: doc.previewUrl
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
  };

  // Students Component
  const StudentsTab = () => {
    // States for students management
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Filter students based on search query
    const getFilteredStudents = () => {
      return students.filter(student =>
        student.fullName?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.username?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        student.administrativeClass?.code?.toLowerCase().includes(studentSearchQuery.toLowerCase())
      );
    };

    // Event handlers
    const handleSearchStudent = (event) => {
      setStudentSearchQuery(event.target.value);
      setPage(0);
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
        const newSelecteds = getFilteredStudents().map((student) => student._id);
        setSelectedStudents(newSelecteds);
        return;
      }
      setSelectedStudents([]);
    };

    const isStudentSelected = useCallback((id) => selectedStudents.indexOf(id) !== -1, [selectedStudents]);

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

    const handlePrintList = useCallback(() => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Danh sách sinh viên - ${course?.name || 'Lớp học'}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12px;
              margin: 20px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .header h2 {
              margin: 5px 0;
              font-size: 16px;
              font-weight: normal;
            }
            .course-info {
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .course-info div {
              flex: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature {
              text-align: center;
              margin-top: 50px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
            <h2>KHOA CÔNG NGHỆ THÔNG TIN</h2>
            <h1 style="margin-top: 20px;">DANH SÁCH SINH VIÊN</h1>
          </div>

          <div class="course-info">
            <div>
              <strong>Môn học:</strong> ${course?.name || 'N/A'}<br>
              <strong>Mã môn:</strong> ${course?.code || 'N/A'}<br>
              <strong>Học kỳ:</strong> ${course?.semesterName || 'N/A'}
            </div>
            <div style="text-align: right;">
              <strong>Ngày in:</strong> ${new Date().toLocaleDateString('vi-VN')}<br>
              <strong>Tổng số SV:</strong> ${filteredStudents.length}<br>
              <strong>Số tín chỉ:</strong> ${course?.credits || 'N/A'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px;">STT</th>
                <th style="width: 120px;">Mã sinh viên</th>
                <th style="width: 200px;">Họ và tên</th>
                <th style="width: 100px;">Ngày sinh</th>
                <th style="width: 100px;">Lớp</th>
                <th style="width: 150px;">Ghi chú</th>
                <th style="width: 120px;">Chữ ký</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStudents.map((student, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center">${student.userCode}</td>
                  <td>${student.fullName}</td>
                  <td class="text-center">${student.birthDate || 'N/A'}</td>
                  <td class="text-center">${student.administrativeClass?.code || 'N/A'}</td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="signature">
              <p><strong>Trưởng khoa</strong></p>
              <p style="margin-top: 80px;">(Ký tên và đóng dấu)</p>
            </div>
            <div class="signature">
              <p><strong>Giảng viên</strong></p>
              <p style="margin-top: 80px;">${course?.instructor || 'Tên giảng viên'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }, [filteredStudents]);
  console.log(course);
  // Export Excel functionality
  const handleExportExcel = useCallback(() => {
    try {
      // Chuẩn bị dữ liệu cho Excel
      const excelData = filteredStudents.map((student, index) => ({
        'STT': index + 1,
        'Mã sinh viên': student.userCode,
        'Họ và tên': student.fullName,
        'Ngày sinh': student.birthDate || 'N/A',
        'Lớp': student.administrativeClass?.code || 'N/A',
        'Email': student.email || 'N/A',
        'Số điện thoại': student.phoneNumber || 'N/A',
        'Địa chỉ': student.address || 'N/A',
        'Ghi chú': student.note || ''
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thiết lập độ rộng cột
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 15 },  // Mã sinh viên
        { wch: 25 },  // Họ và tên
        { wch: 12 },  // Ngày sinh
        { wch: 12 },  // Lớp
        { wch: 25 },  // Email
        { wch: 15 },  // Số điện thoại
        { wch: 30 },  // Địa chỉ
        { wch: 20 }   // Ghi chú
      ];
      ws['!cols'] = colWidths;

      // Thêm thông tin header
      const courseInfo = [
        ['DANH SÁCH SINH VIÊN'],
        [''],
        ['Môn học:', course?.name || 'N/A'],
        ['Mã môn:', course?.courseId.code || 'N/A'],
        ['Học kỳ:', "Học kỳ " + course?.semester + ' năm học ' + course?.academicYear || 'N/A'],
        ['Số tín chỉ:', course?.courseId.credits || 'N/A'],
        ['Tổng số sinh viên:', filteredStudents.length],
        ['Ngày xuất:', new Date().toLocaleDateString('vi-VN')],
        ['']
      ];

      // Chèn thông tin header vào đầu worksheet
      XLSX.utils.sheet_add_aoa(ws, courseInfo, { origin: 'A1' });
      
      // Điều chỉnh vị trí dữ liệu sinh viên
      const studentDataRange = XLSX.utils.decode_range(ws['!ref']);
      studentDataRange.s.r = courseInfo.length; // Bắt đầu từ dòng sau header
      
      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách sinh viên');

      // Tạo tên file
      const fileName = `DanhSach_SinhVien_${course?.code || 'Class'}_${new Date().getTime()}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);

      // Thông báo thành công
      console.log('Xuất Excel thành công:', fileName);
      
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
    }
  }, [filteredStudents]);

  // Export selected students only
  const handleExportSelectedStudents = useCallback(() => {
    if (selectedStudents.length === 0) {
      alert('Vui lòng chọn ít nhất một sinh viên để xuất danh sách');
      return;
    }

    const selectedStudentData = filteredStudents.filter(student => 
      selectedStudents.includes(student._id)
    );

    try {
      const excelData = selectedStudentData.map((student, index) => ({
        'STT': index + 1,
        'Mã sinh viên': student.userCode,
        'Họ và tên': student.fullName,
        'Ngày sinh': student.birthDate || 'N/A',
        'Lớp': student.administrativeClass?.code || 'N/A',
        'Email': student.email || 'N/A',
        'Số điện thoại': student.phoneNumber || 'N/A',
        'Địa chỉ': student.address || 'N/A',
        'Ghi chú': student.note || ''
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 12 }, 
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 20 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Sinh viên đã chọn');

      const fileName = `DanhSach_SinhVien_DaChon_${course?.code || 'Class'}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Lỗi khi xuất Excel cho sinh viên đã chọn:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
    }
  }, [selectedStudents, filteredStudents]);

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
            {/* <Button variant="outlined" startIcon={<PersonAddIcon />}>
              Thêm sinh viên
            </Button> */}
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportExcel}>
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
                onClick={handlePrintList}
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
                  {/* <TableCell
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      minWidth: 120
                    }}
                  >
                    Thao tác
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Đang tải danh sách sinh viên...</Typography>
                      <LinearProgress sx={{ mt: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
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
                      const isItemSelected = isStudentSelected(student._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleSelectStudent(event, student._id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={student._id}
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
                            {student.username}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{ width: 40, height: 40 }}
                              >
                                {student.fullName?.charAt(0) || '?'}
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
                              {student.birthDate || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Chip
                              label={student.administrativeClass?.code || 'N/A'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          {/* <TableCell sx={{ textAlign: 'center' }}>
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
                          </TableCell> */}
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
                  onClick={handleExportSelectedStudents}
                >
                  Xuất danh sách ({numSelected})
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    );
  };

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
              label={course.courseId?.code}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={getStatusLabel(course.status)}
              color={getStatusColor(course.status)}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
            {course.courseId?.description || course.description}
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
          <Tab label="Tài liệu" icon={<FolderIcon />} iconPosition="start" />
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

      <TabPanel value={tabValue} index={2}>
        <DocumentsTab />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <StudentsTab />
      </TabPanel>

      {/* Create Announcement Dialog */}
      <Dialog
        open={createAnnouncementOpen}
        onClose={() => setCreateAnnouncementOpen(false)}
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
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                required
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
              <Box sx={{ alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={announcementForm.sendEmail}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, sendEmail: e.target.checked })}
                      color="primary"
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
              <Box sx={{ border: 0, width: '100%' }}>
                <Editor
                  apiKey="2knowjdoqtj7pi51xfq4e0b9t6b82xiggwnfl5qvuimfnztf"
                  value={announcementForm.content}
                  onEditorChange={(content) => setAnnouncementForm({ ...announcementForm, content })}
                  init={{
                    height: 500,
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
                    setup: function (editor) {
                      editor.on('init', function () {
                        editor.getContainer().style.transition = "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
                      });
                      editor.on('focus', function () {
                        editor.getContainer().style.borderColor = '#1976d2';
                        editor.getContainer().style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
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
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => {
                  setCreateAnnouncementOpen(false);
                  setAnnouncementForm({ title: '', content: '', priority: 'normal', sendEmail: true });
                }}
                variant="outlined"
                startIcon={<CloseIcon />}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (!announcementForm.title.trim()) {
                    alert('Vui lòng nhập tiêu đề thông báo');
                    return;
                  }
                  if (!announcementForm.content.trim()) {
                    alert('Vui lòng nhập nội dung thông báo');
                    return;
                  }
                  handleCreateAnnouncement();
                }}
                variant="contained"
                startIcon={<SendIcon />}
                disabled={!announcementForm.title.trim() || !announcementForm.content.trim()}
              >
                Đăng thông báo
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;