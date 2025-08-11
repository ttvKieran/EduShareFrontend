import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing imports...
import Home from './components/student/Home/index.jsx';
import Courses from './components/student/Courses';
import Login from './components/Login/index.jsx';
import AppLayout from './components/AppLayout/index.jsx';
import NoMatch from './components/NoMatch/index.jsx';
import ProtectedRoute from './components/ProtectedRoute/index.jsx';
import CourseDetail from './components/student/CourseDetail';
import DocumentDetail from './components/DocumentDetail/index.jsx';
import Profile from './components/Profile';
import Help from './components/student/Help';
import DocumentsList from './components/DocumentList/index.jsx';
import CourseNotificationsPage from './components/student/CourseNotification/index.jsx';

// Add AuthProvider import
import { AuthProvider } from './contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoriteProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
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