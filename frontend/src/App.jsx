import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { EventPage } from './pages/event/EventPage.jsx';
import { MyEventPage } from './pages/event/MyEventPage.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/components/authComponents.css'
import './styles/components/eventComponent.css'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/events/my-events" element={<MyEventPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
