import { createTheme } from '@mui/material/styles';

const lecturerTheme = createTheme({
  palette: {
    primary: {
      main: '#42a5f5', // Xanh dương nhạt chính
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e3f2fd', // Xanh dương rất nhạt
      light: '#ffffff',
      dark: '#b1bfca',
      contrastText: '#000000',
    },
    background: {
      default: '#f8fbff', // Nền tổng thể xanh dương rất nhạt
      paper: '#ffffff',
    },
    text: {
      primary: '#1e3a8a', // Xanh đậm cho text chính
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1e3a8a',
    },
    h5: {
      fontWeight: 600,
      color: '#1e3a8a',
    },
    h6: {
      fontWeight: 500,
      color: '#1e40af',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#42a5f5',
          color: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f1f8ff',
          borderRight: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(66, 165, 245, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(66, 165, 245, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            borderRight: '3px solid #42a5f5',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          },
          '&:hover': {
            backgroundColor: '#f1f8ff',
          },
        },
      },
    },
  },
});

export default lecturerTheme;