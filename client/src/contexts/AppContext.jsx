import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/api';
import { message } from 'antd';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState({
    events: false,
    attendees: false,
    attendance: false,
  });
  const [error, setError] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await api.getEvents();
      setEvents(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to fetch events');
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Fetch attendees
  const fetchAttendees = async () => {
    try {
      setLoading(prev => ({ ...prev, attendees: true }));
      const response = await api.getAttendees();
      setAttendees(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to fetch attendees');
    } finally {
      setLoading(prev => ({ ...prev, attendees: false }));
    }
  };

  // Fetch attendance for an event
  const fetchEventAttendance = async (eventId) => {
    try {
      setLoading(prev => ({ ...prev, attendance: true }));
      const response = await api.getEventAttendance(eventId);
      setAttendance(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to fetch attendance records');
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  // Add event
  const addEvent = async (eventData) => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await api.createEvent(eventData);
      setEvents(prev => [...prev, response.data]);
      message.success('Event created successfully');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to create event');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Update event
  const updateEvent = async (id, eventData) => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await api.updateEvent(id, eventData);
      setEvents(prev => prev.map(event => event.id === id ? response.data : event));
      message.success('Event updated successfully');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to update event');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Delete event
  const removeEvent = async (id) => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      message.success('Event deleted successfully');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to delete event');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Add attendee
  const addAttendee = async (attendeeData) => {
    try {
      setLoading(prev => ({ ...prev, attendees: true }));
      const response = await api.createAttendee(attendeeData);
      setAttendees(prev => [...prev, response.data]);
      message.success('Attendee added successfully');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error(err.response?.data?.error || 'Failed to add attendee');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, attendees: false }));
    }
  };

  // Update attendee
  const updateAttendee = async (id, attendeeData) => {
    try {
      setLoading(prev => ({ ...prev, attendees: true }));
      const response = await api.updateAttendee(id, attendeeData);
      setAttendees(prev => prev.map(attendee => attendee.id === id ? response.data : attendee));
      message.success('Attendee updated successfully');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error(err.response?.data?.error || 'Failed to update attendee');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, attendees: false }));
    }
  };

  // Delete attendee
  const removeAttendee = async (id) => {
    try {
      setLoading(prev => ({ ...prev, attendees: true }));
      await api.deleteAttendee(id);
      setAttendees(prev => prev.filter(attendee => attendee.id !== id));
      message.success('Attendee deleted successfully');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to delete attendee');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, attendees: false }));
    }
  };

  // Record attendance
  const recordAttendance = async (attendanceData) => {
    try {
      setLoading(prev => ({ ...prev, attendance: true }));
      const response = await api.recordAttendance(attendanceData);
      
      // Update attendance list
      setAttendance(prev => {
        const index = prev.findIndex(a => 
          a.event_id === attendanceData.event_id && a.attendee_id === attendanceData.attendee_id);
        
        if (index >= 0) {
          return prev.map((a, i) => i === index ? response.data : a);
        } else {
          return [...prev, response.data];
        }
      });
      
      message.success('Attendance recorded successfully');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to record attendance');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  // Delete attendance record
  const removeAttendanceRecord = async (id) => {
    try {
      setLoading(prev => ({ ...prev, attendance: true }));
      await api.deleteAttendanceRecord(id);
      setAttendance(prev => prev.filter(record => record.id !== id));
      message.success('Attendance record deleted');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      message.error('Failed to delete attendance record');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  const value = {
    events,
    attendees,
    loading,
    error,
    currentEvent,
    attendance,
    setCurrentEvent,
    fetchEvents,
    fetchAttendees,
    fetchEventAttendance,
    addEvent,
    updateEvent,
    removeEvent,
    addAttendee,
    updateAttendee,
    removeAttendee,
    recordAttendance,
    removeAttendanceRecord,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 