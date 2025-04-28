import { Typography } from 'antd';
import AttendanceTracker from '../components/AttendanceTracker';

const { Title } = Typography;

const AttendancePage = () => {
  return (
    <div style={{ padding: '0 16px' }}>
      <Title level={2}>Attendance Management</Title>
      <p>Select an event to manage attendance and track who's present.</p>
      <AttendanceTracker />
    </div>
  );
};

export default AttendancePage; 