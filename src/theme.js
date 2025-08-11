import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Định nghĩa palette màu chủ đạo
const colors = {
  primary: {
    main: '#DC143C', // Đỏ crimson chủ đạo
    light: '#FF6B6B', // Đỏ nhạt
    dark: '#B71C1C', // Đỏ đậm
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F5F5F5', // Trắng xám nhẹ
    light: '#FFFFFF', // Trắng tinh khôi
    dark: '#E0E0E0', // Xám nhẹ
    contrastText: '#DC143C',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#546E7A',
    disabled: '#B0BEC5',
  },
  accent: {
    red: '#FF5252',
    lightRed: '#FFEBEE',
    darkRed: '#C62828',
  }
};

// Tạo theme với nhiều hiệu ứng và transitions
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    error: {
      main: '#F44336',
      light: '#FFCDD2',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFE0B2',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#BBDEFB',
      dark: '#1976D2',
    },
    success: {
      main: '#4CAF50',
      light: '#C8E6C9',
      dark: '#388E3C',
    },
    divider: alpha(colors.primary.main, 0.12),
  },
  
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(220, 20, 60, 0.05)',
    '0px 4px 8px rgba(220, 20, 60, 0.08)',
    '0px 6px 12px rgba(220, 20, 60, 0.1)',
    '0px 8px 16px rgba(220, 20, 60, 0.12)',
    '0px 10px 20px rgba(220, 20, 60, 0.15)',
    '0px 12px 24px rgba(220, 20, 60, 0.18)',
    '0px 14px 28px rgba(220, 20, 60, 0.2)',
    '0px 16px 32px rgba(220, 20, 60, 0.22)',
    '0px 18px 36px rgba(220, 20, 60, 0.25)',
    '0px 20px 40px rgba(220, 20, 60, 0.28)',
    '0px 22px 44px rgba(220, 20, 60, 0.3)',
    '0px 24px 48px rgba(220, 20, 60, 0.32)',
    '0px 26px 52px rgba(220, 20, 60, 0.35)',
    '0px 28px 56px rgba(220, 20, 60, 0.38)',
    '0px 30px 60px rgba(220, 20, 60, 0.4)',
    '0px 32px 64px rgba(220, 20, 60, 0.42)',
    '0px 34px 68px rgba(220, 20, 60, 0.45)',
    '0px 36px 72px rgba(220, 20, 60, 0.48)',
    '0px 38px 76px rgba(220, 20, 60, 0.5)',
    '0px 40px 80px rgba(220, 20, 60, 0.52)',
    '0px 42px 84px rgba(220, 20, 60, 0.55)',
    '0px 44px 88px rgba(220, 20, 60, 0.58)',
    '0px 46px 92px rgba(220, 20, 60, 0.6)',
    '0px 48px 96px rgba(220, 20, 60, 0.62)',
  ],

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin', /* Firefox */
          scrollbarColor: '#c1c1c1 #f5f5f5',

          /* Chrome, Edge, Safari */
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a0a0a0',
          },
        },
      },
    },
    // Button Components với hiệu ứng đẹp
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(220, 20, 60, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.primary.contrastText,
          boxShadow: '0px 4px 12px rgba(220, 20, 60, 0.2)',
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
            boxShadow: '0px 8px 25px rgba(220, 20, 60, 0.3)',
          },
          '&:disabled': {
            background: alpha(colors.primary.main, 0.3),
            color: alpha(colors.primary.contrastText, 0.5),
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          borderWidth: 2,
          '&:hover': {
            borderColor: colors.primary.dark,
            backgroundColor: alpha(colors.primary.main, 0.05),
            borderWidth: 2,
          },
        },
        text: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
      },
    },

    // Card Components với hiệu ứng hover
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(220, 20, 60, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${alpha(colors.primary.main, 0.08)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.primary.light})`,
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(220, 20, 60, 0.15)',
            '&::before': {
              transform: 'scaleX(1)',
            },
          },
        },
      },
    },

    // Paper Components
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(220, 20, 60, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(220, 20, 60, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(220, 20, 60, 0.12)',
        },
      },
    },

    // AppBar Components
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          boxShadow: '0px 4px 20px rgba(220, 20, 60, 0.15)',
          backdropFilter: 'blur(10px)',
        },
      },
    },

    // Chip Components
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        filled: {
          backgroundColor: alpha(colors.primary.main, 0.1),
          color: colors.primary.dark,
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.15),
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          '&:hover': {
            borderColor: colors.primary.dark,
            backgroundColor: alpha(colors.primary.main, 0.05),
          },
        },
      },
    },

    // TextField Components
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.light,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },

    // Dialog Components
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 16px 40px rgba(220, 20, 60, 0.2)',
        },
      },
    },

    // Menu Components
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 8px 24px rgba(220, 20, 60, 0.15)',
          border: `1px solid ${alpha(colors.primary.main, 0.08)}`,
        },
      },
    },

    // MenuItem Components
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.12),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.15),
            },
          },
        },
      },
    },

    // Tab Components
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: colors.primary.main,
            transform: 'translateY(-2px)',
          },
          '&.Mui-selected': {
            color: colors.primary.main,
            fontWeight: 600,
          },
        },
      },
    },

    // Tabs indicator
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.primary.main,
          height: 3,
          borderRadius: '2px 2px 0 0',
        },
      },
    },

    // IconButton Components
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
            transform: 'scale(1.1)',
          },
        },
      },
    },

    // Fab Components
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 6px 16px rgba(220, 20, 60, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0px 10px 24px rgba(220, 20, 60, 0.3)',
          },
        },
      },
    },

    // Switch Components
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              color: colors.primary.main,
              '& + .MuiSwitch-track': {
                backgroundColor: colors.primary.main,
              },
            },
          },
        },
      },
    },

    // Checkbox Components
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },

    // Radio Components
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
          '&.Mui-checked': {
            color: colors.primary.main,
          },
        },
      },
    },

    // LinearProgress Components
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: alpha(colors.primary.main, 0.1),
        },
        bar: {
          borderRadius: 4,
          backgroundColor: colors.primary.main,
        },
      },
    },

    // Drawer Components
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
          border: 'none',
          boxShadow: '4px 0 20px rgba(220, 20, 60, 0.1)',
        },
      },
    },

    // Snackbar Components
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            backgroundColor: colors.primary.main,
          },
        },
      },
    },

    // Tooltip Components
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.primary.dark,
          borderRadius: 8,
          fontSize: '0.75rem',
        },
        arrow: {
          color: colors.primary.dark,
        },
      },
    },
  },
});

export default theme;