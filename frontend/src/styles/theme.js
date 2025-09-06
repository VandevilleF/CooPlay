import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#6366f1',
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#6366f1',
      marginBottom: '0.5rem',
    },
    h6: {
      fontWeight: 400,
      fontSize: '1rem',
      color: '#9ca3af',
      marginBottom: '2rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Card d'authentification personnalisée
    MuiContainer: {
      styleOverrides: {
        root: {
          '&.auth-card': {
            backgroundColor: '#2a2a2a',
            borderRadius: 16,
            padding: '2rem 2.5rem',
            maxWidth: '420px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }
        }
      }
    },
    // TextField personnalisé pour l'auth
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.auth-input': {
            width: '100%',
            marginBottom: '1.5rem',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#3a3a3a',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#4a4a4a',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: '#6366f1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
                borderWidth: '2px',
              },
              '& input': {
                color: '#ffffff',
                padding: '14px 16px',
                '&::placeholder': {
                  color: '#9ca3af',
                  opacity: 1,
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#6366f1',
              },
            },
          }
        }
      }
    },
    // Button personnalisé pour l'auth
    MuiButton: {
      styleOverrides: {
        root: {
          '&.auth-button': {
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '14px 0',
            width: '100%',
            borderRadius: '8px',
            textTransform: 'none',
            marginTop: '1rem',
            marginBottom: '1rem',
            '&:hover': {
              backgroundColor: '#5856eb',
            },
            '&:focus': {
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
            },
          },
          '&.auth-link': {
            color: '#6366f1',
            fontWeight: 400,
            textTransform: 'none',
            textDecoration: 'none',
            padding: '0.5rem',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }
        }
      }
    },
    // Typography pour les liens
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.auth-divider': {
            color: '#9ca3af',
            fontSize: '0.875rem',
          },
          '&.auth-forgot': {
            color: '#6366f1',
            fontSize: '0.875rem',
            cursor: 'pointer',
            textAlign: 'right',
            width: '100%',
            marginBottom: '1rem',
            '&:hover': {
              textDecoration: 'underline',
            },
          }
        }
      }
    }
  }
})

export const authBackgroundStyles = {
  minHeight: '100vh',
  height: '100vh',
  background: 'linear-gradient(180deg, #667EEA 0%, #764BA2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}
