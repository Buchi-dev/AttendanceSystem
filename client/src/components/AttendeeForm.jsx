import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useAppContext } from '../contexts/AppContext';

const { Title } = Typography;

const AttendeeForm = ({ attendee, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addAttendee, updateAttendee } = useAppContext();
  const isEditing = !!attendee;

  useEffect(() => {
    if (attendee) {
      form.setFieldsValue(attendee);
    } else {
      form.resetFields();
    }
  }, [attendee, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (isEditing) {
        await updateAttendee(attendee.id, values);
      } else {
        await addAttendee(values);
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
      <Title level={4}>{isEditing ? 'Edit Attendee' : 'Add New Attendee'}</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ phone: '' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the attendee name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter the email address' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        
        <Form.Item name="phone" label="Phone">
          <Input placeholder="Enter phone number (optional)" />
        </Form.Item>
        
        <Form.Item className="form-buttons">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Update Attendee' : 'Add Attendee'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AttendeeForm;