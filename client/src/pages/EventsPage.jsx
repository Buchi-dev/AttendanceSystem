import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Typography, Modal, Badge, Spin, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppContext } from '../contexts/AppContext';
import EventForm from '../components/EventForm';

const { Title } = Typography;

const EventsPage = () => {
  const { events, loading, removeEvent, fetchEvents } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setModalVisible(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setDetailsVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await removeEvent(id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchEvents();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => location || <Tag color="default">Not specified</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewDetails(record)}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditEvent(record)}
          />
          <Popconfirm
            title="Delete this event?"
            description="All attendance records for this event will also be deleted"
            onConfirm={() => handleDeleteEvent(record.id)}
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
        <Title level={2}>Events</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddEvent}
        >
          Add Event
        </Button>
      </div>

      <Spin spinning={loading.events}>
        <Table
          dataSource={events}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      {/* Event Form Modal */}
      <Modal
        title={selectedEvent ? "Edit Event" : "Add New Event"}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <EventForm
          event={selectedEvent}
          onCancel={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      {/* Event Details Modal */}
      <Modal
        title="Event Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setDetailsVisible(false);
              handleEditEvent(selectedEvent);
            }}
          >
            Edit Event
          </Button>,
        ]}
        width={600}
      >
        {selectedEvent && (
          <div>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {selectedEvent.location || 'Not specified'}</p>
            <p><strong>Description:</strong></p>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              {selectedEvent.description || 'No description provided'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventsPage; 