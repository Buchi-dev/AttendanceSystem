import { useState, useEffect } from 'react';
import { Table, Select, Button, Space, Tag, Typography, Modal, Empty, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useAppContext } from '../contexts/AppContext';

const { Title } = Typography;
const { Option } = Select;

const AttendanceTracker = () => {
  const { 
    events, 
    loading, 
    currentEvent,
    setCurrentEvent,
    attendance,
    fetchEventAttendance,
    recordAttendance,
    removeAttendanceRecord
  } = useAppContext();
  
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [unregisteredAttendees, setUnregisteredAttendees] = useState([]);
  const [addAttendeeModalVisible, setAddAttendeeModalVisible] = useState(false);
  
  useEffect(() => {
    if (currentEvent) {
      fetchEventAttendance(currentEvent);
      fetchUnregisteredAttendees();
    }
  }, [currentEvent]);
  
  const fetchUnregisteredAttendees = async () => {
    if (!currentEvent) return;
    try {
      const response = await fetch(`http://localhost:3000/api/events/${currentEvent}/unregistered-attendees`);
      const data = await response.json();
      setUnregisteredAttendees(data);
    } catch (error) {
      console.error('Error fetching unregistered attendees:', error);
    }
  };

  const handleEventChange = (eventId) => {
    setCurrentEvent(eventId);
  };
  
  const handleAddAttendees = async () => {
    if (!selectedAttendees.length || !currentEvent) return;
    
    try {
      const promises = selectedAttendees.map(attendeeId => 
        recordAttendance({
          event_id: currentEvent,
          attendee_id: attendeeId,
          status: 'present'
        })
      );
      
      await Promise.all(promises);
      setAddAttendeeModalVisible(false);
      setSelectedAttendees([]);
      fetchUnregisteredAttendees();
    } catch (error) {
      console.error('Error adding attendees:', error);
    }
  };
  
  const updateAttendanceStatus = async (record, status) => {
    try {
      await recordAttendance({
        event_id: record.event_id,
        attendee_id: record.attendee_id,
        status
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };
  
  const removeAttendance = async (id) => {
    try {
      await Modal.confirm({
        title: 'Are you sure you want to remove this attendance record?',
        content: 'This action cannot be undone',
        onOk: () => removeAttendanceRecord(id)
      });
    } catch (error) {
      console.error('Error removing attendance:', error);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'present':
        return <Tag icon={<CheckCircleOutlined />} color="success">Present</Tag>;
      case 'absent':
        return <Tag icon={<CloseCircleOutlined />} color="error">Absent</Tag>;
      default:
        return <Tag icon={<QuestionCircleOutlined />} color="warning">Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Time Recorded',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type={record.status === 'present' ? 'primary' : 'default'} 
            size="small"
            onClick={() => updateAttendanceStatus(record, 'present')}
          >
            Present
          </Button>
          <Button 
            type={record.status === 'absent' ? 'primary' : 'default'} 
            danger={record.status !== 'absent'} 
            size="small"
            onClick={() => updateAttendanceStatus(record, 'absent')}
          >
            Absent
          </Button>
          <Button 
            type="text" 
            danger
            size="small"
            onClick={() => removeAttendance(record.id)}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const attendeeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div>
      <Title level={3}>Attendance Tracker</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 300, marginRight: 16 }}
          placeholder="Select an event"
          value={currentEvent}
          onChange={handleEventChange}
          loading={loading.events}
        >
          {events.map(event => (
            <Option key={event.id} value={event.id}>
              {event.title} ({event.date})
            </Option>
          ))}
        </Select>
        
        <Button 
          type="primary"
          onClick={() => setAddAttendeeModalVisible(true)}
          disabled={!currentEvent || unregisteredAttendees.length === 0}
        >
          Add Attendees
        </Button>
      </div>
      
      {currentEvent ? (
        <Spin spinning={loading.attendance}>
          <Table 
            dataSource={attendance} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="No attendance records found" /> }}
          />
        </Spin>
      ) : (
        <Empty description="Please select an event to view attendance" />
      )}
      
      {/* Add Attendees Modal */}
      <Modal
        title="Add Attendees to Event"
        open={addAttendeeModalVisible}
        onCancel={() => setAddAttendeeModalVisible(false)}
        onOk={handleAddAttendees}
        okButtonProps={{ disabled: selectedAttendees.length === 0 }}
        width={700}
      >
        <Select
          mode="multiple"
          style={{ width: '100%', marginBottom: 16 }}
          placeholder="Select attendees to add"
          value={selectedAttendees}
          onChange={setSelectedAttendees}
          optionFilterProp="children"
        >
          {unregisteredAttendees.map(attendee => (
            <Option key={attendee.id} value={attendee.id}>
              {attendee.name} ({attendee.email})
            </Option>
          ))}
        </Select>
        
        <Table 
          dataSource={unregisteredAttendees.filter(a => selectedAttendees.includes(a.id))}
          columns={attendeeColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default AttendanceTracker; 