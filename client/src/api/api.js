import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Events API
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getEventAttendance = (eventId) => api.get(`/events/${eventId}/attendance`);
export const getUnregisteredAttendees = (eventId) => api.get(`/events/${eventId}/unregistered-attendees`);

// Attendees API
export const getAttendees = () => api.get('/attendees');
export const getAttendee = (id) => api.get(`/attendees/${id}`);
export const createAttendee = (data) => api.post('/attendees', data);
export const updateAttendee = (id, data) => api.put(`/attendees/${id}`, data);
export const deleteAttendee = (id) => api.delete(`/attendees/${id}`);

// Attendance API
export const recordAttendance = (data) => api.post('/attendance', data);
export const deleteAttendanceRecord = (id) => api.delete(`/attendance/${id}`);

export default api; 