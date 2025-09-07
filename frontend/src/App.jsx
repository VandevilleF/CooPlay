import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';

import './styles/components/authComponents.css'
import './styles/global.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RegisterPage />
    </ThemeProvider>
  );
}

export default App
