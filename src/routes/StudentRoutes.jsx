import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout.jsx';

// Import components với error handling
const importComponent = (componentPath, componentName) => {
  try {
    return require(componentPath).default;
  } catch (error) {
    console.error(`Failed to import ${componentName}:`, error);
    // Return fallback component
    return () => (
      <div style={{ padding: '20px', border: '2px solid red' }}>
        <h2>Error loading {componentName}</h2>
        <p>Path: {componentPath}</p>
        <p>Error: {error.message}</p>
      </div>
    );
  }
};

// Import student components với fallback
let Home, Courses, CourseDetail, CourseNotification, Help;
let DocumentDetail, DocumentList, Profile;

try {
  Home = require('../components/student/Home/index.jsx').default;
} catch (error) {
  console.error('Failed to import Home:', error);
  Home = () => <div style={{padding: '20px'}}><h2>Home Component Missing</h2></div>;
}

try {
  Courses = require('../components/student/Courses/index.jsx').default;
} catch (error) {
  console.error('Failed to import Courses:', error);
  Courses = () => <div style={{padding: '20px'}}><h2>Courses Component Missing</h2></div>;
}

try {
  CourseDetail = require('../components/student/CourseDetail/index.jsx').default;
} catch (error) {
  console.error('Failed to import CourseDetail:', error);
  CourseDetail = () => <div style={{padding: '20px'}}><h2>CourseDetail Component Missing</h2></div>;
}

try {
  CourseNotification = require('../components/student/CourseNotification/index.jsx').default;
} catch (error) {
  console.error('Failed to import CourseNotification:', error);
  CourseNotification = () => <div style={{padding: '20px'}}><h2>CourseNotification Component Missing</h2></div>;
}

try {
  Help = require('../components/student/Help/index.jsx').default;
} catch (error) {
  console.error('Failed to import Help:', error);
  Help = () => <div style={{padding: '20px'}}><h2>Help Component Missing</h2></div>;
}

// Shared components
try {
  DocumentDetail = require('../components/shared/DocumentDetail/index.jsx').default;
} catch (error) {
  console.error('Failed to import DocumentDetail:', error);
  DocumentDetail = () => <div style={{padding: '20px'}}><h2>DocumentDetail Component Missing</h2></div>;
}

try {
  DocumentList = require('../components/shared/DocumentList/index.jsx').default;
} catch (error) {
  console.error('Failed to import DocumentList:', error);
  DocumentList = () => <div style={{padding: '20px'}}><h2>DocumentList Component Missing</h2></div>;
}

try {
  Profile = require('../components/shared/Profile/index.jsx').default;
} catch (error) {
  console.error('Failed to import Profile:', error);
  Profile = () => <div style={{padding: '20px'}}><h2>Profile Component Missing</h2></div>;
}

const StudentRoutes = () => {
  console.log('StudentRoutes rendering...');
  console.log('Current path:', window.location.pathname);
  
  return (
    <StudentLayout>
        <Routes>
          {/* Trang chủ sinh viên */}
          <Route index element={
            <div>
              <h3>Index Route Hit!</h3>
              <Home />
            </div>
          } />
          
          {/* Quản lý môn học */}
          <Route path="courses" element={
            <div>
              <h3>Courses Route Hit!</h3>
              <Courses />
            </div>
          } />
          
          <Route path="course-detail/:classId" element={
            <div>
              <h3>CourseDetail Route Hit!</h3>
              <CourseDetail />
            </div>
          } />
          
          {/* Chi tiết tài liệu */}
          <Route path="document-detail/:documentId" element={
            <div>
              <h3>DocumentDetail Route Hit!</h3>
              <DocumentDetail />
            </div>
          } />
          
          {/* Các loại tài liệu */}
          <Route 
            path="curriculum" 
            element={
              <div>
                <h3>Curriculum Route Hit!</h3>
                <DocumentList 
                  typeSelect="curriculum" 
                  typeName="Giáo trình" 
                  nav="Tài liệu"
                />
              </div>
            } 
          />
          
          <Route 
            path="lecture" 
            element={
              <div>
                <h3>Lecture Route Hit!</h3>
                <DocumentList 
                  typeSelect="lecture" 
                  typeName="Bài giảng" 
                  nav="Tài liệu"
                />
              </div>
            } 
          />
          
          <Route 
            path="exam" 
            element={
              <div>
                <h3>Exam Route Hit!</h3>
                <DocumentList 
                  typeSelect="exam" 
                  typeName="Đề thi" 
                  nav="Tài liệu"
                />
              </div>
            } 
          />
          
          <Route 
            path="exercise" 
            element={
              <div>
                <h3>Exercise Route Hit!</h3>
                <DocumentList 
                  typeSelect="exercise" 
                  typeName="Bài tập" 
                  nav="Tài liệu"
                />
              </div>
            } 
          />
          
          <Route 
            path="reference" 
            element={
              <div>
                <h3>Reference Route Hit!</h3>
                <DocumentList 
                  typeSelect="reference" 
                  typeName="Tài liệu tham khảo" 
                  nav="Tài liệu"
                />
              </div>
            } 
          />
          
          {/* Thông báo */}
          <Route path="notifications" element={
            <div>
              <h3>Notifications Route Hit!</h3>
              <CourseNotification />
            </div>
          } />
          
          <Route 
            path="courses/notifications/:courseId/:courseName" 
            element={
              <div>
                <h3>Course Notifications Route Hit!</h3>
                <CourseNotification />
              </div>
            }
          />
          
          {/* Thông tin cá nhân & Trợ giúp */}
          <Route path="profile" element={
            <div>
              <h3>Profile Route Hit!</h3>
              <Profile />
            </div>
          } />
          
          <Route path="help" element={
            <div>
              <h3>Help Route Hit!</h3>
              <Help />
            </div>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={
            <div style={{ padding: '20px', border: '2px solid orange' }}>
              <h3>❌ No Route Matched!</h3>
              <p>Current path: {window.location.pathname}</p>
              <p>Available routes:</p>
              <ul>
                <li>/student (index)</li>
                <li>/student/courses</li>
                <li>/student/profile</li>
                <li>/student/help</li>
                <li>etc...</li>
              </ul>
            </div>
          } />
        </Routes>
    </StudentLayout>
  );
};

export default StudentRoutes;