import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Avatar,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    LinearProgress,
    Tab,
    Tabs,
    Paper,
    Switch,
    FormControlLabel,
    InputAdornment,
    Tooltip,
    Badge,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton
} from '@mui/material';
import {
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    CalendarToday as CalendarIcon,
    Language as LanguageIcon,
    Badge as BadgeIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Lock as LockIcon,
    VpnKey as VpnKeyIcon,
    Archive as ArchiveIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    People as PeopleIcon,
    MenuBook as MenuBookIcon,
    Star as StarIcon,
    EmojiEvents as EmojiEventsIcon,
    Timeline as TimelineIcon,
    ExpandMore as ExpandMoreIcon,
    Group as GroupIcon,
    Class as ClassIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LecturerProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [editing, setEditing] = useState({});
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [avatarDialog, setAvatarDialog] = useState(false);
    const [showPassword, setShowPassword] = useState({});

    // Profile data state
    const [profileData, setProfileData] = useState({
        // Thông tin cơ bản - có thể chỉnh sửa
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        bio: '',
        avatar: '/api/placeholder/150/150',
        
        // Thông tin nghề nghiệp - chỉ đọc hoặc hạn chế
        employeeId: '',
        position: '',
        department: '',
        faculty: '',
        academicRank: '',
        degree: '',
        startDate: '',
        status: '',
        workingHours: '',
        officeLocation: '',
        
        // Thông tin liên hệ - có thể chỉnh sửa
        personalEmail: '',
        emergencyContact: '',
        emergencyPhone: '',
        socialLinks: {
            linkedin: '',
            researchGate: '',
            googleScholar: '',
            orcid: ''
        },
        
        // Cài đặt - có thể chỉnh sửa
        settings: {
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh',
            notifications: {
                email: true,
                push: true,
                sms: false,
                newAssignment: true,
                gradeUpdates: true,
                systemUpdates: true,
                announcements: true
            },
            privacy: {
                showEmail: false,
                showPhone: false,
                showOffice: true,
                profileVisible: true
            }
        }
    });

    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Statistics data
    const [stats, setStats] = useState({
        totalCourses: 8,
        totalClasses: 15,
        totalStudents: 450,
        totalDocuments: 67,
        totalAssignments: 125,
        averageRating: 4.7,
        teachingYears: 12,
        researchPapers: 23,
        achievements: [
            { title: 'Giảng viên xuất sắc 2023', date: '2023-09-15', type: 'award' },
            { title: 'Hoàn thành 1000 giờ giảng dạy', date: '2023-06-20', type: 'milestone' },
            { title: 'Nghiên cứu được công bố tại IEEE', date: '2023-04-10', type: 'research' }
        ]
    });

    // Recent activities
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: 'course',
            title: 'Cập nhật tài liệu môn Lập trình hướng đối tượng',
            description: 'Đã thêm 3 tài liệu mới cho bài học về Inheritance',
            timestamp: '2024-08-15T10:30:00Z',
            icon: <MenuBookIcon />
        },
        {
            id: 2,
            type: 'grade',
            title: 'Chấm điểm bài tập lớp IT3040.001',
            description: 'Đã chấm xong 42/42 bài tập về Design Patterns',
            timestamp: '2024-08-14T16:45:00Z',
            icon: <AssignmentIcon />
        },
        {
            id: 3,
            type: 'announcement',
            title: 'Gửi thông báo lịch thi cuối kỳ',
            description: 'Thông báo lịch thi cho 3 lớp học trong tuần tới',
            timestamp: '2024-08-13T14:20:00Z',
            icon: <NotificationsIcon />
        }
    ]);

    // Mock data initialization
    useEffect(() => {
        setTimeout(() => {
            setProfileData({
                fullName: 'PGS.TS. Nguyễn Văn Minh',
                email: 'nvminh@university.edu.vn',
                phone: '0987654321',
                dateOfBirth: '1980-05-15',
                gender: 'Nam',
                address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
                bio: 'Giảng viên khoa Công nghệ Thông tin với 12 năm kinh nghiệm giảng dạy và nghiên cứu. Chuyên môn về Lập trình hướng đối tượng, Cấu trúc dữ liệu và Trí tuệ nhân tạo.',
                avatar: '/api/placeholder/150/150',
                
                employeeId: 'GV001234',
                position: 'Phó Giáo sư',
                department: 'Khoa Công nghệ Thông tin',
                faculty: 'Đại học Bách khoa Hà Nội',
                academicRank: 'Phó Giáo sư',
                degree: 'Tiến sĩ Khoa học máy tính',
                startDate: '2012-09-01',
                status: 'Đang làm việc',
                workingHours: 'Thứ 2-6: 8:00-17:00',
                officeLocation: 'Phòng 301, Tòa C1',
                
                personalEmail: 'nguyenvanminh@gmail.com',
                emergencyContact: 'Nguyễn Thị Lan (Vợ)',
                emergencyPhone: '0912345678',
                socialLinks: {
                    linkedin: 'https://linkedin.com/in/nguyenvanminh',
                    researchGate: 'https://researchgate.net/profile/nguyen-van-minh',
                    googleScholar: 'https://scholar.google.com/citations?user=abc123',
                    orcid: '0000-0000-0000-0000'
                },
                
                settings: {
                    language: 'vi',
                    timezone: 'Asia/Ho_Chi_Minh',
                    notifications: {
                        email: true,
                        push: true,
                        sms: false,
                        newAssignment: true,
                        gradeUpdates: true,
                        systemUpdates: true,
                        announcements: true
                    },
                    privacy: {
                        showEmail: false,
                        showPhone: false,
                        showOffice: true,
                        profileVisible: true
                    }
                }
            });
            setLoading(false);
        }, 1000);
    }, []);

    // Event handlers
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditToggle = (field) => {
        setEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = (field) => {
        // API call to save data
        console.log('Saving field:', field, profileData[field]);
        setEditing(prev => ({
            ...prev,
            [field]: false
        }));
        toast.success('Cập nhật thông tin thành công!');
    };

    const handleCancel = (field) => {
        // Reset data to original value
        setEditing(prev => ({
            ...prev,
            [field]: false
        }));
        // Reload original data here if needed
        toast.info('Đã hủy thay đổi');
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = (parentField, childField, value) => {
        setProfileData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: value
            }
        }));
    };

    const handleChangePassword = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        // API call to change password
        console.log('Changing password');
        setChangePasswordDialog(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Đổi mật khẩu thành công!');
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Upload avatar logic
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
                toast.success('Cập nhật ảnh đại diện thành công!');
            };
            reader.readAsDataURL(file);
        }
    };

    // Render field with edit capability
    const EditableField = ({ 
        label, 
        field, 
        type = 'text', 
        multiline = false, 
        rows = 1, 
        options = [], 
        icon,
        readonly = false,
        helperText = ''
    }) => {
        const isEditing = editing[field];
        const value = profileData[field] || '';

        return (
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        {label}
                    </Typography>
                    {!readonly && (
                        <Box>
                            {isEditing ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small" color="primary" onClick={() => handleSave(field)}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="secondary" onClick={() => handleCancel(field)}>
                                        <CancelIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton size="small" onClick={() => handleEditToggle(field)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    )}
                </Box>
                
                {isEditing ? (
                    type === 'select' ? (
                        <FormControl fullWidth size="small">
                            <Select
                                value={value}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                            >
                                {options.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            type={type}
                            multiline={multiline}
                            rows={rows}
                            value={value}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            helperText={helperText}
                            InputLabelProps={type === 'date' ? { shrink: true } : {}}
                        />
                    )
                ) : (
                    <Typography variant="body2" sx={{ 
                        color: readonly ? 'text.secondary' : 'text.primary',
                        minHeight: '24px',
                        padding: '4px 0',
                        fontStyle: readonly ? 'italic' : 'normal'
                    }}>
                        {value || 'Chưa cập nhật'}
                        {readonly && <Chip label="Chỉ đọc" size="small" sx={{ ml: 1, height: 16 }} />}
                    </Typography>
                )}
            </Box>
        );
    };

    // Tab panels
    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="80%" height={30} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Thông tin cá nhân
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
                </Typography>
            </Box>

            {/* Profile Header Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profileData.avatar}
                                    sx={{ 
                                        width: 120, 
                                        height: 120,
                                        border: '4px solid',
                                        borderColor: 'primary.main'
                                    }}
                                >
                                    {profileData.fullName?.charAt(0)}
                                </Avatar>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleAvatarChange}
                                />
                                <label htmlFor="avatar-upload">
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' }
                                        }}
                                        size="small"
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </label>
                            </Box>
                        </Grid>
                        
                        <Grid item xs>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                {profileData.fullName}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                                {profileData.position} • {profileData.employeeId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {profileData.department}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip 
                                    icon={<SchoolIcon />} 
                                    label={profileData.academicRank} 
                                    color="primary" 
                                    size="small" 
                                />
                                <Chip 
                                    icon={<WorkIcon />} 
                                    label={`${stats.teachingYears} năm kinh nghiệm`} 
                                    color="success" 
                                    size="small" 
                                />
                                <Chip 
                                    icon={<StarIcon />} 
                                    label={`${stats.averageRating}/5.0`} 
                                    color="warning" 
                                    size="small" 
                                />
                            </Box>

                            <Typography variant="body2" sx={{ maxWidth: 600 }}>
                                {profileData.bio}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={12}>
                                    <Card sx={{ textAlign: 'center', p: 1.5 }}>
                                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                                            {stats.totalCourses}
                                        </Typography>
                                        <Typography variant="caption">Môn học</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} md={12}>
                                    <Card sx={{ textAlign: 'center', p: 1.5 }}>
                                        <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                                            {stats.totalStudents}
                                        </Typography>
                                        <Typography variant="caption">Sinh viên</Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="Thông tin cá nhân" icon={<PersonIcon />} iconPosition="start" />
                    <Tab label="Thông tin nghề nghiệp" icon={<WorkIcon />} iconPosition="start" />
                    <Tab label="Liên hệ & Mạng xã hội" icon={<EmailIcon />} iconPosition="start" />
                    <Tab label="Cài đặt tài khoản" icon={<SettingsIcon />} iconPosition="start" />
                    <Tab label="Bảo mật" icon={<SecurityIcon />} iconPosition="start" />
                    <Tab label="Hoạt động & Thành tích" icon={<EmojiEventsIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Thông tin cá nhân
                                </Typography>
                                
                                <EditableField
                                    label="Họ và tên"
                                    field="fullName"
                                    icon={<PersonIcon />}
                                />
                                
                                <EditableField
                                    label="Ngày sinh"
                                    field="dateOfBirth"
                                    type="date"
                                    icon={<CalendarIcon />}
                                />
                                
                                <EditableField
                                    label="Giới tính"
                                    field="gender"
                                    type="select"
                                    options={[
                                        { value: 'Nam', label: 'Nam' },
                                        { value: 'Nữ', label: 'Nữ' },
                                        { value: 'Khác', label: 'Khác' }
                                    ]}
                                />
                                
                                <EditableField
                                    label="Số điện thoại"
                                    field="phone"
                                    icon={<PhoneIcon />}
                                />
                                
                                <EditableField
                                    label="Địa chỉ"
                                    field="address"
                                    multiline
                                    rows={2}
                                    icon={<LocationIcon />}
                                />
                                
                                <EditableField
                                    label="Giới thiệu bản thân"
                                    field="bio"
                                    multiline
                                    rows={4}
                                    helperText="Mô tả ngắn về bản thân, kinh nghiệm và chuyên môn"
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Thống kê nhanh
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon><ClassIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary="Lớp học" 
                                            secondary={`${stats.totalClasses} lớp đang dạy`} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><MenuBookIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary="Tài liệu" 
                                            secondary={`${stats.totalDocuments} tài liệu`} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><AssignmentIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary="Bài tập" 
                                            secondary={`${stats.totalAssignments} bài tập`} 
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                                        <ListItemText 
                                            primary="Nghiên cứu" 
                                            secondary={`${stats.researchPapers} bài báo`} 
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Thông tin nghề nghiệp
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <EditableField
                                    label="Mã giảng viên"
                                    field="employeeId"
                                    icon={<BadgeIcon />}
                                    readonly
                                />
                                
                                <EditableField
                                    label="Chức vụ"
                                    field="position"
                                    icon={<WorkIcon />}
                                    readonly
                                />
                                
                                <EditableField
                                    label="Khoa/Bộ môn"
                                    field="department"
                                    icon={<SchoolIcon />}
                                    readonly
                                />
                                
                                <EditableField
                                    label="Trường"
                                    field="faculty"
                                    readonly
                                />
                                
                                <EditableField
                                    label="Học hàm"
                                    field="academicRank"
                                    readonly
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <EditableField
                                    label="Học vị"
                                    field="degree"
                                    readonly
                                />
                                
                                <EditableField
                                    label="Ngày bắt đầu làm việc"
                                    field="startDate"
                                    type="date"
                                    readonly
                                />
                                
                                <EditableField
                                    label="Trạng thái"
                                    field="status"
                                    readonly
                                />
                                
                                <EditableField
                                    label="Giờ làm việc"
                                    field="workingHours"
                                />
                                
                                <EditableField
                                    label="Phòng làm việc"
                                    field="officeLocation"
                                    icon={<LocationIcon />}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Thông tin liên hệ
                                </Typography>
                                
                                <EditableField
                                    label="Email cơ quan"
                                    field="email"
                                    type="email"
                                    icon={<EmailIcon />}
                                    readonly
                                />
                                
                                <EditableField
                                    label="Email cá nhân"
                                    field="personalEmail"
                                    type="email"
                                    icon={<EmailIcon />}
                                />
                                
                                <EditableField
                                    label="Người liên hệ khẩn cấp"
                                    field="emergencyContact"
                                />
                                
                                <EditableField
                                    label="SĐT khẩn cấp"
                                    field="emergencyPhone"
                                    icon={<PhoneIcon />}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Mạng xã hội & Nghiên cứu
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        LinkedIn
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={profileData.socialLinks.linkedin}
                                        onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/your-profile"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        ResearchGate
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={profileData.socialLinks.researchGate}
                                        onChange={(e) => handleNestedInputChange('socialLinks', 'researchGate', e.target.value)}
                                        placeholder="https://researchgate.net/profile/your-profile"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Google Scholar
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={profileData.socialLinks.googleScholar}
                                        onChange={(e) => handleNestedInputChange('socialLinks', 'googleScholar', e.target.value)}
                                        placeholder="https://scholar.google.com/citations?user=your-id"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        ORCID
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={profileData.socialLinks.orcid}
                                        onChange={(e) => handleNestedInputChange('socialLinks', 'orcid', e.target.value)}
                                        placeholder="0000-0000-0000-0000"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Cài đặt chung
                                </Typography>
                                
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Ngôn ngữ
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={profileData.settings.language}
                                            onChange={(e) => handleNestedInputChange('settings', 'language', e.target.value)}
                                        >
                                            <MenuItem value="vi">Tiếng Việt</MenuItem>
                                            <MenuItem value="en">English</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Múi giờ
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={profileData.settings.timezone}
                                            onChange={(e) => handleNestedInputChange('settings', 'timezone', e.target.value)}
                                        >
                                            <MenuItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</MenuItem>
                                            <MenuItem value="Asia/Bangkok">Bangkok (GMT+7)</MenuItem>
                                            <MenuItem value="Asia/Singapore">Singapore (GMT+8)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Cài đặt thông báo
                                </Typography>
                                
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.notifications.email}
                                                onChange={(e) => {
                                                    const newNotifications = {
                                                        ...profileData.settings.notifications,
                                                        email: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'notifications', newNotifications);
                                                }}
                                            />
                                        }
                                        label="Thông báo qua Email"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.notifications.push}
                                                onChange={(e) => {
                                                    const newNotifications = {
                                                        ...profileData.settings.notifications,
                                                        push: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'notifications', newNotifications);
                                                }}
                                            />
                                        }
                                        label="Thông báo đẩy"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.notifications.newAssignment}
                                                onChange={(e) => {
                                                    const newNotifications = {
                                                        ...profileData.settings.notifications,
                                                        newAssignment: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'notifications', newNotifications);
                                                }}
                                            />
                                        }
                                        label="Bài tập mới"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.notifications.systemUpdates}
                                                onChange={(e) => {
                                                    const newNotifications = {
                                                        ...profileData.settings.notifications,
                                                        systemUpdates: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'notifications', newNotifications);
                                                }}
                                            />
                                        }
                                        label="Cập nhật hệ thống"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Đổi mật khẩu
                                </Typography>
                                
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và thay đổi định kỳ.
                                </Alert>
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<LockIcon />}
                                    onClick={() => setChangePasswordDialog(true)}
                                    fullWidth
                                >
                                    Đổi mật khẩu
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Cài đặt riêng tư
                                </Typography>
                                
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.privacy.showEmail}
                                                onChange={(e) => {
                                                    const newPrivacy = {
                                                        ...profileData.settings.privacy,
                                                        showEmail: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'privacy', newPrivacy);
                                                }}
                                            />
                                        }
                                        label="Hiển thị email với sinh viên"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.privacy.showPhone}
                                                onChange={(e) => {
                                                    const newPrivacy = {
                                                        ...profileData.settings.privacy,
                                                        showPhone: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'privacy', newPrivacy);
                                                }}
                                            />
                                        }
                                        label="Hiển thị số điện thoại"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.privacy.showOffice}
                                                onChange={(e) => {
                                                    const newPrivacy = {
                                                        ...profileData.settings.privacy,
                                                        showOffice: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'privacy', newPrivacy);
                                                }}
                                            />
                                        }
                                        label="Hiển thị phòng làm việc"
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={profileData.settings.privacy.profileVisible}
                                                onChange={(e) => {
                                                    const newPrivacy = {
                                                        ...profileData.settings.privacy,
                                                        profileVisible: e.target.checked
                                                    };
                                                    handleNestedInputChange('settings', 'privacy', newPrivacy);
                                                }}
                                            />
                                        }
                                        label="Hồ sơ công khai"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Thành tích & Giải thưởng
                                </Typography>
                                
                                <List>
                                    {stats.achievements.map((achievement, index) => (
                                        <ListItem key={index} divider={index < stats.achievements.length - 1}>
                                            <ListItemIcon>
                                                <EmojiEventsIcon color="warning" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={achievement.title}
                                                secondary={new Date(achievement.date).toLocaleDateString('vi-VN')}
                                            />
                                            <Chip
                                                label={achievement.type}
                                                size="small"
                                                color={achievement.type === 'award' ? 'warning' : 'primary'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Hoạt động gần đây
                                </Typography>
                                
                                <List>
                                    {recentActivities.map((activity) => (
                                        <ListItem key={activity.id} divider>
                                            <ListItemIcon>
                                                {activity.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={activity.title}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {activity.description}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Thống kê chi tiết
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                                                {stats.teachingYears}
                                            </Typography>
                                            <Typography variant="caption">Năm giảng dạy</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                                                {stats.researchPapers}
                                            </Typography>
                                            <Typography variant="caption">Bài báo</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                                            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                                                {stats.averageRating}
                                            </Typography>
                                            <Typography variant="caption">Đánh giá TB</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                                            <Typography variant="h4" color="info.main" sx={{ fontWeight: 600 }}>
                                                {stats.achievements.length}
                                            </Typography>
                                            <Typography variant="caption">Thành tích</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Change Password Dialog */}
            <Dialog
                open={changePasswordDialog}
                onClose={() => setChangePasswordDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon />
                        Đổi mật khẩu
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Mật khẩu hiện tại"
                            type={showPassword.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                            edge="end"
                                        >
                                            {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Mật khẩu mới"
                            type={showPassword.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Mật khẩu phải có ít nhất 6 ký tự"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                            edge="end"
                                        >
                                            {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Xác nhận mật khẩu mới"
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            error={passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword}
                            helperText={
                                passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword 
                                    ? 'Mật khẩu xác nhận không khớp' 
                                    : ''
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            edge="end"
                                        >
                                            {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangePasswordDialog(false)}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleChangePassword}
                        variant="contained"
                        disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    >
                        Đổi mật khẩu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LecturerProfile;