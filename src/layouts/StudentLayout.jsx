import React from 'react';
import AppLayout from '../components/shared/AppLayout/index.jsx';

const StudentLayout = ({ children }) => {
  return (
    <AppLayout userRole="student">
      <div>
        {children}
      </div>
    </AppLayout>
  );
};

export default StudentLayout;