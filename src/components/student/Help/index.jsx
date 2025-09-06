import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryBooksIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Help as HelpIcon,
  Assignment as AssignmentIcon,
  Computer as ComputerIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

const StudentHelpPage = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const quickActions = [
    {
      title: 'Tải học liệu',
      icon: <DownloadIcon />,
      description: 'Tải xuống tài liệu học tập',
      color: '#d32f2f'
    },
    {
      title: 'Thông báo',
      icon: <NotificationsIcon />,
      description: 'Xem thông báo mới nhất',
      color: '#d32f2f'
    },
    {
      title: 'Hỗ trợ kỹ thuật',
      icon: <ComputerIcon />,
      description: 'Báo cáo lỗi hệ thống',
      color: '#d32f2f'
    }
  ];

  const contactInfo = [
    {
      title: 'Phòng Đào tạo',
      icon: <SchoolIcon />,
      details: [
        { label: 'Email', value: 'daotao@university.edu.vn', icon: <EmailIcon /> },
        { label: 'Điện thoại', value: '024.1234.5678', icon: <PhoneIcon /> },
        { label: 'Phòng', value: 'A101 - Tòa nhà chính', icon: <LocationOnIcon /> }
      ]
    },
    {
      title: 'Hỗ trợ kỹ thuật',
      icon: <ComputerIcon />,
      details: [
        { label: 'Email', value: 'support@university.edu.vn', icon: <EmailIcon /> },
        { label: 'Hotline', value: '1900.1234', icon: <PhoneIcon /> },
        { label: 'Thời gian', value: '8:00 - 17:00 (T2-T6)', icon: <AccessTimeIcon /> }
      ]
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để tải xuống học liệu?',
      answer: 'Đăng nhập vào hệ thống, vào mục "Học liệu" của môn học tương ứng, sau đó click vào nút "Tải xuống" bên cạnh tài liệu bạn muốn tải.'
    },
    {
      question: 'Tôi không thể đăng nhập vào hệ thống?',
      answer: 'Kiểm tra lại tên đăng nhập và mật khẩu. Nếu vẫn không được, hãy liên hệ phòng Đào tạo hoặc bộ phận hỗ trợ kỹ thuật để được hỗ trợ reset mật khẩu.'
    },
    {
      question: 'Tôi không tìm thấy học liệu cho môn học của mình?',
      answer: 'Học liệu sẽ được cập nhật theo lịch trình của từng môn học. Nếu đã quá thời gian quy định mà chưa có học liệu, vui lòng liên hệ giảng viên hoặc phòng Đào tạo.'
    },
    {
      question: 'Làm thế nào để thay đổi thông tin cá nhân?',
      answer: 'Vào mục "Thông tin cá nhân" trong hệ thống, chỉnh sửa thông tin cần thiết và bấm "Lưu thay đổi". Một số thông tin quan trọng có thể cần phê duyệt từ phòng Đào tạo.'
    },
    {
      question: 'Hệ thống có hỗ trợ trên điện thoại không?',
      answer: 'Có, hệ thống được thiết kế tương thích với các thiết bị di động. Bạn có thể truy cập thông qua trình duyệt trên smartphone hoặc tablet.'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      pt: 2,
      pb: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: '#212529',
            mb: 2
          }}>
            Trợ giúp
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#6c757d',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Hướng dẫn sử dụng hệ thống quản lý học liệu và thông tin liên hệ hỗ trợ
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                },
                border: '1px solid #e9ecef'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: action.color,
                    width: 56, 
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* FAQ Section */}
          <Grid item xs={12} md={8} sx={{width: '100%'}}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <QuestionAnswerIcon sx={{ color: '#d32f2f' }} />
                  Câu hỏi thường gặp
                </Typography>
                
                {faqs.map((faq, index) => (
                  <Accordion 
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                    sx={{ 
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                      border: '1px solid #e9ecef',
                      mb: 1,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: '#f8f9fa',
                        '&:hover': { backgroundColor: '#e9ecef' }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <SecurityIcon sx={{ color: '#d32f2f' }} />
                  Yêu cầu hệ thống
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  Để sử dụng hệ thống tốt nhất, vui lòng đảm bảo các yêu cầu sau:
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pl: 2 }}>
                      Trình duyệt được hỗ trợ:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Google Chrome (phiên bản 90+)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Mozilla Firefox (phiên bản 88+)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Microsoft Edge (phiên bản 90+)" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Safari (phiên bản 14+)" />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pl: 2 }}>
                      Yêu cầu khác:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Kết nối internet ổn định" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="JavaScript được bật" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Cookies được cho phép" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Độ phân giải tối thiểu 1024x768" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4} sx={{width: '100%'}}>
            <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'space-between'}}>
              {contactInfo.map((contact, index) => (
                <Grid item xs={12} key={index} sx={{width: '48%'}}>
                <Card key={index} sx={{ 
                    width: '100%',
                  border: '1px solid #e9ecef',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {React.cloneElement(contact.icon, { sx: { color: '#d32f2f' } })}
                      {contact.title}
                    </Typography>
                    
                    <List dense>
                      {contact.details.map((detail, detailIndex) => (
                        <ListItem key={detailIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {React.cloneElement(detail.icon, { 
                              sx: { color: '#6c757d', fontSize: 18 } 
                            })}
                          </ListItemIcon>
                          <ListItemText 
                            primary={detail.label}
                            secondary={detail.value}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              fontWeight: 'medium'
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body2',
                              color: 'text.primary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
                </Grid>
              ))}

              {/* Emergency Contact */}
              <Card sx={{ 
                width: '26%',
                backgroundColor: '#fff5f5',
                border: '1px solid #fecaca'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    color: '#d32f2f'
                  }}>
                    Liên hệ khẩn cấp
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Nếu gặp sự cố nghiêm trọng với hệ thống:
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<PhoneIcon />}
                    sx={{ mb: 1 }}
                  >
                    Hotline: 1900.1234
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<EmailIcon />}
                  >
                    emergency@university.edu.vn
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card sx={{ 
                width: '70%',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <StarIcon sx={{ color: '#0369a1' }} />
                    Mẹo sử dụng
                  </Typography>
                  
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Đăng xuất sau khi sử dụng xong"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Thường xuyên kiểm tra thông báo"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Tải học liệu về máy để học offline"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary="Cập nhật thông tin liên hệ thường xuyên"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentHelpPage;