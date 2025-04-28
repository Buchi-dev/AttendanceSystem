import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Typography, Modal, Spin, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppContext } from '../contexts/AppContext';
import AttendeeForm from '../components/AttendeeForm';

const { Title } = Typography;

const AttendeesPage = () => {
  const { attendees, loading, removeAttendee, fetchAttendees } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  const handleAddAttendee = () => {
    setSelectedAttendee(null);
    setModalVisible(true);
  };

  const handleEditAttendee = (attendee) => {
    setSelectedAttendee(attendee);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedAttendee(null);
  };

  const handleDeleteAttendee = async (id) => {
    try {
      await removeAttendee(id);
    } catch (error) {
      console.error('Error deleting attendee:', error);
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchAttendees();
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || <Tag color="default">Not provided</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditAttendee(record)}
          />
          <Popconfirm
            title="Delete this attendee?"
            description="All attendance records for this attendee will also be deleted"
            onConfirm={() => handleDeleteAttendee(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Attendees</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAttendee}
        >
          Add Attendee
        </Button>
      </div>

      <Spin spinning={loading.attendees}>
        <Table
          dataSource={attendees}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      {/* Attendee Form Modal */}
      <Modal
        title={selectedAttendee ? "Edit Attendee" : "Add New Attendee"}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <AttendeeForm
          attendee={selectedAttendee}
          onCancel={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </Modal>
    </div>
  );
};

export default AttendeesPage; 