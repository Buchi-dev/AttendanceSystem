const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

// Data directory setup
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const ATTENDEES_FILE = path.join(DATA_DIR, 'attendees.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ATTENDEES_FILE)) {
    fs.writeFileSync(ATTENDEES_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ATTENDANCE_FILE)) {
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify([]));
  }
  console.log('Data files initialized successfully');
}

initializeDataFiles();

// Helper functions for file operations
function readDataFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

function writeDataFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    return false;
  }
}

function getNextId(collection) {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
}

// EVENTS ENDPOINTS
app.get("/api/events", (req, res) => {
  try {
    const events = readDataFile(EVENTS_FILE);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/events/:id", (req, res) => {
  try {
    const events = readDataFile(EVENTS_FILE);
    const event = events.find(e => e.id === parseInt(req.params.id));
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/events", (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    const events = readDataFile(EVENTS_FILE);
    const newId = getNextId(events);
    
    const newEvent = {
      id: newId,
      title,
      date,
      location,
      description,
      created_at: new Date().toISOString()
    };
    
    events.push(newEvent);
    writeDataFile(EVENTS_FILE, events);
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/events/:id", (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const id = parseInt(req.params.id);
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    const events = readDataFile(EVENTS_FILE);
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    events[eventIndex] = {
      ...events[eventIndex],
      title,
      date,
      location,
      description
    };
    
    writeDataFile(EVENTS_FILE, events);
    
    res.json(events[eventIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/events/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const events = readDataFile(EVENTS_FILE);
    const newEvents = events.filter(e => e.id !== id);
    
    if (events.length === newEvents.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Delete related attendance records
    const attendance = readDataFile(ATTENDANCE_FILE);
    const newAttendance = attendance.filter(a => a.event_id !== id);
    
    writeDataFile(EVENTS_FILE, newEvents);
    writeDataFile(ATTENDANCE_FILE, newAttendance);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ATTENDEES ENDPOINTS
app.get("/api/attendees", (req, res) => {
  try {
    const attendees = readDataFile(ATTENDEES_FILE);
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/attendees/:id", (req, res) => {
  try {
    const attendees = readDataFile(ATTENDEES_FILE);
    const attendee = attendees.find(a => a.id === parseInt(req.params.id));
    
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/attendees", (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const attendees = readDataFile(ATTENDEES_FILE);
    
    // Check for duplicate email
    if (attendees.some(a => a.email === email)) {
      return res.status(400).json({ error: 'Email address already registered' });
    }
    
    const newId = getNextId(attendees);
    
    const newAttendee = {
      id: newId,
      name,
      email,
      phone,
      created_at: new Date().toISOString()
    };
    
    attendees.push(newAttendee);
    writeDataFile(ATTENDEES_FILE, attendees);
    
    res.status(201).json(newAttendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/attendees/:id", (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = parseInt(req.params.id);
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const attendees = readDataFile(ATTENDEES_FILE);
    const attendeeIndex = attendees.findIndex(a => a.id === id);
    
    if (attendeeIndex === -1) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Check for duplicate email (except for this attendee)
    if (attendees.some(a => a.email === email && a.id !== id)) {
      return res.status(400).json({ error: 'Email address already registered' });
    }
    
    attendees[attendeeIndex] = {
      ...attendees[attendeeIndex],
      name,
      email,
      phone
    };
    
    writeDataFile(ATTENDEES_FILE, attendees);
    
    res.json(attendees[attendeeIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/attendees/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const attendees = readDataFile(ATTENDEES_FILE);
    const newAttendees = attendees.filter(a => a.id !== id);
    
    if (attendees.length === newAttendees.length) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Delete related attendance records
    const attendance = readDataFile(ATTENDANCE_FILE);
    const newAttendance = attendance.filter(a => a.attendee_id !== id);
    
    writeDataFile(ATTENDEES_FILE, newAttendees);
    writeDataFile(ATTENDANCE_FILE, newAttendance);
    
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ATTENDANCE ENDPOINTS
app.get("/api/events/:eventId/attendance", (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const events = readDataFile(EVENTS_FILE);
    
    // Check if event exists
    if (!events.some(e => e.id === eventId)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const attendance = readDataFile(ATTENDANCE_FILE);
    const attendees = readDataFile(ATTENDEES_FILE);
    
    // Get attendance records with attendee info
    const attendanceWithInfo = attendance
      .filter(a => a.event_id === eventId)
      .map(record => {
        const attendee = attendees.find(a => a.id === record.attendee_id);
        return {
          ...record,
          name: attendee?.name,
          email: attendee?.email,
          phone: attendee?.phone
        };
      });
    
    res.json(attendanceWithInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/attendance", (req, res) => {
  try {
    const { event_id, attendee_id, status } = req.body;
    
    if (!event_id || !attendee_id || !status) {
      return res.status(400).json({ error: 'Event ID, attendee ID, and status are required' });
    }
    
    const events = readDataFile(EVENTS_FILE);
    const attendees = readDataFile(ATTENDEES_FILE);
    const attendance = readDataFile(ATTENDANCE_FILE);
    
    // Validate event and attendee exist
    if (!events.some(e => e.id === event_id)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (!attendees.some(a => a.id === attendee_id)) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    
    // Check if attendance record already exists
    const existingIndex = attendance.findIndex(
      a => a.event_id === event_id && a.attendee_id === attendee_id
    );
    
    let record;
    
    if (existingIndex !== -1) {
      // Update existing record
      attendance[existingIndex].status = status;
      attendance[existingIndex].timestamp = new Date().toISOString();
      record = attendance[existingIndex];
    } else {
      // Create new record
      const newId = getNextId(attendance);
      record = {
        id: newId,
        event_id,
        attendee_id,
        status,
        timestamp: new Date().toISOString()
      };
      attendance.push(record);
    }
    
    writeDataFile(ATTENDANCE_FILE, attendance);
    
    // Add attendee info to response
    const attendee = attendees.find(a => a.id === attendee_id);
    const response = {
      ...record,
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/attendance/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const attendance = readDataFile(ATTENDANCE_FILE);
    const newAttendance = attendance.filter(a => a.id !== id);
    
    if (attendance.length === newAttendance.length) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    writeDataFile(ATTENDANCE_FILE, newAttendance);
    
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/events/:eventId/unregistered-attendees", (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const events = readDataFile(EVENTS_FILE);
    
    // Check if event exists
    if (!events.some(e => e.id === eventId)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const attendees = readDataFile(ATTENDEES_FILE);
    const attendance = readDataFile(ATTENDANCE_FILE);
    
    // Get attendees not registered for this event
    const registeredAttendeeIds = attendance
      .filter(a => a.event_id === eventId)
      .map(a => a.attendee_id);
    
    const unregisteredAttendees = attendees.filter(
      a => !registeredAttendeeIds.includes(a.id)
    );
    
    res.json(unregisteredAttendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

