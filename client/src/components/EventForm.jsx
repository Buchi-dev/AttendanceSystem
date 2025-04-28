import { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { useAppContext } from '../contexts/AppContext';

const { Title } = Typography;
const { TextArea } = Input;

const EventForm = ({ event, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addEvent, updateEvent } = useAppContext();
  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      form.setFieldsValue({
        ...event,
        date: event.date ? dayjs(event.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [event, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      
      if (isEditing) {
        await updateEvent(event.id, formattedValues);
      } else {
        await addEvent(formattedValues);
      }
      
      if (onSuccess) onSuccess();
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={4}>{isEditing ? 'Edit Event' : 'Create New Event'}</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ description: '', location: '' }}
      >
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter the event title' }]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>
        
        <Form.Item
          name="date"
          label="Event Date"
          rules={[{ required: true, message: 'Please select the event date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="location" label="Location">
          <Input placeholder="Enter event location (optional)" />
        </Form.Item>
        
        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter event description (optional)" />
        </Form.Item>
        
        <Form.Item className="form-buttons">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EventForm; 