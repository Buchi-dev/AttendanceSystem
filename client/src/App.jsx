import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider } from './contexts/AppContext';

// Layout
import AppLayout from './components/Layout';

// Pages
import EventsPage from './pages/EventsPage';
import AttendeesPage from './pages/AttendeesPage';
import AttendancePage from './pages/AttendancePage';

// Theme customization
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<EventsPage />} />
              <Route path="attendees" element={<AttendeesPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ConfigProvider>
  );
}

export default App;
