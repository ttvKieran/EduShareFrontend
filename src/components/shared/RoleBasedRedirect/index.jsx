import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  const getRoleBasedPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'lecturer':
        return '/lecturer';
      case 'student':
      default:
        return '/student';
    }
  };

  return <Navigate to={getRoleBasedPath()} replace />;
};

export default RoleBasedRedirect;