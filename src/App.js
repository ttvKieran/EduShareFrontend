import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './themes/theme.js';
import themeLecturer from './themes/themeLecturer.js';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from 'react';

// Existing imports...
import AccessDeniedPage from './components/shared/AccessDeniedPage/index.jsx';
import Home from './components/student/Home/index.jsx';
import Courses from './components/student/Courses';
import Login from './components/shared/Login/index.jsx';
import AppLayout from './components/shared/AppLayout/index.jsx';
import NoMatch from './components/shared/NoMatch/index.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute/index.jsx';
import CourseDetail from './components/student/CourseDetail';
import DocumentDetail from './components/shared/DocumentDetail/index.jsx';
import Profile from './components/shared/Profile';
import Help from './components/student/Help';
import DocumentsList from './components/shared/DocumentList/index.jsx';
import CourseNotificationsPage from './components/student/CourseNotification/index.jsx';

// Lecturer
import AppLayoutLecturer from './components/lecturer/AppLayout';
import DashboardLecturer from './components/lecturer/Dashboard';
import ClassesLecturer from './components/lecturer/Classes/index.jsx';
import ScheduleLecturer from './components/lecturer/Schedule';
import ClassDetailLecturer from './components/lecturer/ClassDetail/index.jsx';
import CoursesLecturer from './components/lecturer/Courses';
import CourseDetailLecturer from './components/lecturer/CourseDetail';
import ProfileLecturer from './components/lecturer/Profile';
import CourseNotificationsLecturer from './components/lecturer/CourseNotification';
import CourseReport from './components/lecturer/CourseReport';

// Admin

// Add AuthProvider import
import { AuthProvider } from './contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import MyDocuments from './components/lecturer/MyDocuments/index.jsx';
import DocumentUpload from './components/lecturer/DocumentUpload/index.jsx';
import TeachingActivityReport from './components/lecturer/TeachingActivityReport/index.jsx';
import AccessAnalyticsReport from './components/lecturer/AccessAnalyticsReport/index.jsx';
import StudentPerformanceReport from './components/lecturer/StudentPerformanceReport/index.jsx';
import ClassReport from './components/lecturer/ClassReport/index.jsx';
import LecturerHelp from './components/lecturer/LecturerHelp/index.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoriteProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              
              <Route
                path="/lecturer"
                element={
                  <ProtectedRoute requiredRole="lecturer">
                    <AppLayoutLecturer />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardLecturer />} />
                <Route path='classes' element={<ClassesLecturer />} />
                <Route path='classes/classesOfCourse/:courseId' element={<ClassesLecturer />} />
                <Route path='classes/:classId' element={<ClassDetailLecturer />}></Route>
                <Route path='schedule' element={<ScheduleLecturer />} />
                <Route path='documents' element={<MyDocuments />} />
                <Route path='documents/upload' element={<DocumentUpload />} />
                <Route path='courses' element={<CoursesLecturer />} />
                <Route path='courses/notifications' element={<CourseNotificationsLecturer />} />
                <Route path='courses/:courseId' element={<CourseDetailLecturer />} />
                <Route path='profile' element={<ProfileLecturer />} />
                <Route path='notifications' element={<CourseNotificationsPage />} />
                <Route path='reports/activity' element={<TeachingActivityReport />} />
                <Route path='reports/analytics' element={<AccessAnalyticsReport />} />
                <Route path='reports/study' element={<StudentPerformanceReport />} />
                <Route path='reports/course/:id' element={<CourseReport /> } />                <Route path='reports/course/:id' element={<CourseReport /> } />
                <Route path='reports/class/:id' element={<ClassReport /> } />
                <Route path='help' element={<LecturerHelp /> } />

              </Route>

              <Route
                path="/"
                element={
                  <ProtectedRoute requiredRole="student">
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* All your existing nested routes but without ProtectedRoute wrapper */}
                <Route index element={<Home />} />
                <Route path="courses" element={<Courses />} />
                <Route path="course-detail/:classId" element={<CourseDetail />} />
                <Route path="document-detail/:documentId" element={<DocumentDetail />} />
                <Route path="curriculum" element={<DocumentsList typeSelect="curriculum" typeName="Giáo trình" nav="Tài liệu"/>} />
                <Route path="lecture" element={<DocumentsList typeSelect="lecture" typeName="Bài giảng" nav="Tài liệu"/>} />
                <Route path="exam" element={<DocumentsList typeSelect="exam" typeName="Đề thi" nav="Tài liệu"/>} />
                <Route path="exercise" element={<DocumentsList typeSelect="exercise" typeName="Bài tập" nav="Tài liệu"/>} />
                <Route path="reference" element={<DocumentsList typeSelect="reference" typeName="Tài liệu tham khảo" nav="Tài liệu"/>} />
                <Route path="profile" element={<Profile />} />
                <Route path="help" element={<Help />} />
                <Route path="test" element={<DocumentsList />} />
                <Route path="courses/notifications/:courseId/:courseName" element={<CourseNotificationsPage />}/>
                <Route path="notifications" element={<CourseNotificationsPage />}></Route>
              </Route>
              
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </Router>
          <ToastContainer position="top-right" autoClose={2000} />
        </FavoriteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;