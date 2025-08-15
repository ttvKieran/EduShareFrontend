import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  console.log('=== ProtectedRoute Debug ===');
  console.log('Loading:', loading);
  console.log('IsAuthenticated:', isAuthenticated);
  console.log('User:', currentUser);
  console.log('Required Role:', requiredRole);
  console.log('Current Path:', window.location.pathname);

  // Hiển thị loading khi đang check auth
  if (loading) {
    console.log('Showing loading screen...');
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang kiểm tra quyền truy cập...</Typography>
      </Box>
    );
  }

  // Redirect to login nếu chưa authenticate
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role nếu required
  if (requiredRole && currentUser?.role !== requiredRole) {
    console.log(`Role mismatch. Required: ${requiredRole}, Current: ${currentUser?.role}`);
    // Redirect to appropriate dashboard based on user role
    const redirectPath = `/${currentUser?.role || 'student'}`;
    console.log(`Redirecting to: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('All checks passed, rendering children');
  return children;
};

export default ProtectedRoute;