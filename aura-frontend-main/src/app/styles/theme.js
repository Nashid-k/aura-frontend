import { alpha, createTheme } from '@mui/material/styles';

// Deep Space Palette
const deepSpace = {
  bg: '#020617', // Slate 950
  surface: '#0F172A', // Slate 900
  border: 'rgba(255, 255, 255, 0.08)',
  accentGlow: 'rgba(249, 115, 22, 0.15)',
};

const shadows = {
  soft: '0 8px 32px rgba(0, 0, 0, 0.4)',
  medium: '0 16px 48px rgba(0, 0, 0, 0.5)',
  hard: '0 24px 80px rgba(0, 0, 0, 0.7)',
  glow: `0 0 40px ${deepSpace.accentGlow}`,
  inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F97316', // Orange 500
      light: '#FB923C', // Orange 400
      dark: '#EA580C', // Orange 600
    },
    secondary: {
      main: '#2DD4BF', // Teal 400
      light: '#5EEAD4', // Teal 300
      dark: '#0F766E', // Teal 700
    },
    background: {
      default: deepSpace.bg,
      paper: deepSpace.surface,
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#94A3B8', // Slate 400
    },
    success: { main: '#10B981' },
    error: { main: '#F43F5E' },
    warning: { main: '#F59E0B' },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: '-0.05em',
    },
    h2: {
      fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.03em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '-0.01em',
    },
    overline: {
      fontWeight: 800,
      letterSpacing: '0.2em',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      color: '#F97316',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: {
          background: deepSpace.bg,
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(45, 212, 191, 0.05) 0%, transparent 40%)`,
          backgroundAttachment: 'fixed',
          color: '#F8FAFC',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha(deepSpace.surface, 0.4),
          backdropFilter: 'blur(40px)',
          border: `1px solid ${deepSpace.border}`,
          boxShadow: `${shadows.inset}, ${shadows.soft}`,
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: `${shadows.inset}, ${shadows.medium}`,
            backgroundColor: alpha(deepSpace.surface, 0.6),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 28,
          minHeight: 52,
          fontWeight: 700,
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:active': { transform: 'scale(0.95)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(249, 115, 22, 0.45)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#F97316',
            backgroundColor: 'rgba(249, 115, 22, 0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          height: 32,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.3s ease',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(249, 115, 22, 0.3)' },
            '&.Mui-focused fieldset': {
              borderColor: '#F97316',
              boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.1)',
            },
          },
        },
      },
    },
  },
});
