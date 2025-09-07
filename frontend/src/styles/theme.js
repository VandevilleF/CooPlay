import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a1a',
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
})

export const layoutStyles = {
  authBackground: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #667EEA 0%, #764BA2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  }
}
