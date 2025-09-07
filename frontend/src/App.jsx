import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/components/authComponents.css'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <RegisterPage />
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App
