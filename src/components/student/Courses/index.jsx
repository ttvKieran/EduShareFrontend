import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
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
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandMore,
  Home,
  School,
  Assignment,
  Person,
  Settings,
  Notifications,
  Search,
  AccountCircle
} from '@mui/icons-material';
import API_BASE_URL from "../../../configs/system";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import transformData from '../../../helpers/transformData';
import { useAuth } from '../../../contexts/AuthContext';
const StudentCourseSelection = () => {
  // const semesters = [
  //   {
  //     id: 1,
  //     name: 'Học kỳ 1',
  //     courses: [
  //       { id: 1, name: 'Triết học Mác-Lênin', credits: 3, color: '#2196F3' },
  //       { id: 2, name: 'Tin học cơ sở 1', credits: 2, color: '#00BCD4' },
  //       { id: 3, name: 'Giải tích 1', credits: 3, color: '#FF9800' },
  //       { id: 4, name: 'Đại số', credits: 3, color: '#4CAF50' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Học kỳ 2',
  //     courses: [
  //       { id: 5, name: 'Kinh tế chính trị Mác-Lênin', credits: 2, color: '#2196F3' },
  //       { id: 6, name: 'Tiếng Anh (Course 1)', credits: 4, color: '#00BCD4' },
  //       { id: 7, name: 'Tin học cơ sở 2', credits: 2, color: '#FF9800' },
  //       { id: 8, name: 'Giải tích 2', credits: 3, color: '#4CAF50' }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Học kỳ 3',
  //     courses: [
  //       { id: 9, name: 'Vật lý ứng dụng', credits: 4, color: '#00BCD4' },
  //       { id: 10, name: 'Kỹ thuật số', credits: 2, color: '#F44336' },
  //       { id: 11, name: 'Pháp luật đại cương', credits: 2, color: '#FF9800' },
  //       { id: 12, name: 'Chủ nghĩa xã hội khoa học', credits: 2, color: '#2196F3' },
  //       { id: 13, name: 'Tiếng Anh (Course 2)', credits: 4, color: '#00BCD4' },
  //       { id: 14, name: 'Ngôn ngữ lập trình C++', credits: 3, color: '#F44336' },
  //       { id: 15, name: 'Toán rời rạc 1', credits: 3, color: '#F44336' }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'Học kỳ 4',
  //     courses: [
  //       { id: 16, name: 'Xử lý tín hiệu số', credits: 2, color: '#F44336' },
  //       { id: 17, name: 'Xác suất thống kê', credits: 3, color: '#00BCD4' },
  //       { id: 18, name: 'Bất buộc chung', credits: 2, color: '#2196F3' },
  //       { id: 19, name: 'Bộ trợ ngành', credits: 4, color: '#00BCD4' },
  //       { id: 20, name: 'Chuyên ngành', credits: 3, color: '#FF9800' },
  //       { id: 21, name: 'Giáo dục chuyên nghiệp', credits: 3, color: '#9C27B0' }
  //     ]
  //   }
  // ];
  const { currentUser, loading: authLoading } = useAuth();
  console.log(currentUser);
  const semesters = transformData(currentUser.classIds);
  console.log(semesters[0].courses[0].name);
  const navigate = useNavigate();
  const handleCourseClick = (course) => {
    console.log('Selected course:', course);
    navigate(`/course-detail/${course.id}`);
    // Redirect to course materials page
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Content Area */}
      <Box sx={{ flexGrow: 1, p: 5 }}>
        {semesters.map((semester) => (
          <Box key={semester.id} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  backgroundColor: '#BC2626',
                  borderRadius: 1
                }}
              />
              {semester.name}
            </Typography>

            <Grid container spacing={2}>
              {semester.courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                  <Card
                    sx={{
                      height: 100,
                      borderRadius: '5px',
                      width: 150,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 2.7,
                        backgroundColor: course.color
                      }}
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignContent: 'space-around' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          lineHeight: 1.3,
                          // fontSize: '12px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {course.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip
                          label={`${course.credits} tín chỉ`}
                          size="small"
                          sx={{
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StudentCourseSelection;