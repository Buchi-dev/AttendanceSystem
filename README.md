# Attendance Management System

A full-stack application for managing events, attendees, and tracking attendance in real-time. This system provides a complete solution for organizing events and monitoring participation through a clean, intuitive interface.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Codebase Structure](#codebase-structure)
- [Storage Implementation](#storage-implementation)
- [Frontend Implementation](#frontend-implementation)
- [Backend Implementation](#backend-implementation)
- [Setup Instructions](#setup-instructions)
- [API Reference](#api-reference)
- [Component Guide](#component-guide)
- [State Management](#state-management)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Event Management**: Create, view, update, and delete events with title, date, location, and description.
- **Attendee Management**: Manage attendee records including name, email, and contact information.
- **Attendance Tracking**: Record and track attendance status (present/absent) in real-time.
- **Modern UI**: Clean, responsive interface built with Ant Design components for optimal user experience.
- **Data Persistence**: File-based JSON storage for simple deployment and reliable data management.
- **Real-time Updates**: Immediate UI updates when attendance status changes or new records are added.
- **Filtering and Sorting**: Ability to sort and search through events and attendees.
- **Mobile Responsive**: Optimized for both desktop and mobile viewing.

## Technology Stack

### Frontend
- **React 19**: Modern component-based UI library
- **Vite**: Fast build tool and development server
- **Ant Design**: UI component library for enterprise applications
- **React Router (v6)**: Client-side routing
- **Context API**: State management across components
- **Axios**: HTTP client for making API requests
- **Day.js**: Date manipulation library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **File System (fs)**: Node.js module for file I/O operations
- **CORS**: Cross-Origin Resource Sharing middleware
- **JSON**: Data storage format

## Architecture Overview

The application follows a client-server architecture:

```
┌────────────────┐     HTTP/JSON     ┌────────────────┐
│                │<─────────────────>│                │
│  React Client  │    REST API       │  Express Server │
│  (Frontend)    │                   │   (Backend)    │
│                │                   │                │
└────────────────┘                   └───────┬────────┘
                                            │
                                            │ File I/O
                                            ▼
                                     ┌────────────────┐
                                     │   JSON Files   │
                                     │ (Data Storage) │
                                     │                │
                                     └────────────────┘
```

- The React client communicates with the Express server via RESTful API calls.
- The Express server processes requests and performs CRUD operations on JSON files.
- The application uses Context API for client-side state management.
- Ant Design provides consistent UI components throughout the application.

## Codebase Structure

### Root Directory
```
/attendance-system/
├── client/                 # Frontend React application
├── server/                 # Backend Express server
├── package.json            # Root package for running both client and server
└── README.md               # Project documentation
```

### Client Structure
```
/client/
├── public/                 # Static assets
├── src/
│   ├── api/                # API service calls
│   │   └── api.js          # Centralized API functions
│   ├── components/         # Reusable React components
│   │   ├── AttendanceTracker.jsx  # Attendance management component
│   │   ├── AttendeeForm.jsx       # Form for adding/editing attendees
│   │   ├── EventForm.jsx          # Form for adding/editing events
│   │   └── Layout.jsx             # Main application layout
│   ├── contexts/           # React Context providers
│   │   └── AppContext.jsx  # Global state management
│   ├── pages/              # Page components
│   │   ├── AttendancePage.jsx     # Attendance tracking page
│   │   ├── AttendeesPage.jsx      # Attendee management page
│   │   └── EventsPage.jsx         # Event management page
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Frontend dependencies
└── vite.config.js          # Vite configuration
```

### Server Structure
```
/server/
├── data/                   # Data storage directory
│   ├── events.json         # Events data
│   ├── attendees.json      # Attendees data
│   └── attendance.json     # Attendance records
├── index.js                # Server entry point and API implementation
└── package.json            # Backend dependencies
```

## Storage Implementation

The application uses a file-based storage system instead of a traditional database. This approach simplifies deployment and removes database dependencies.

### Data Files

1. **events.json**
   - Stores all event information
   - Schema:
     ```json
     [
       {
         "id": 1,
         "title": "Conference",
         "date": "2023-06-15",
         "location": "Main Hall",
         "description": "Annual conference",
         "created_at": "2023-05-01T12:00:00Z"
       }
     ]
     ```

2. **attendees.json**
   - Stores all attendee information
   - Schema:
     ```json
     [
       {
         "id": 1,
         "name": "John Doe",
         "email": "john@example.com",
         "phone": "123-456-7890",
         "created_at": "2023-05-01T12:00:00Z"
       }
     ]
     ```

3. **attendance.json**
   - Stores attendance records linking events and attendees
   - Schema:
     ```json
     [
       {
         "id": 1,
         "event_id": 1,
         "attendee_id": 1,
         "status": "present",
         "timestamp": "2023-06-15T09:30:00Z"
       }
     ]
     ```

### File Operation Implementations

The server uses these core functions to interact with the data files:

- **readDataFile**: Reads and parses JSON from a file
- **writeDataFile**: Stringifies and writes JSON to a file
- **getNextId**: Generates sequential IDs for new records

These operations ensure data persistence and integrity without a traditional database.

## Frontend Implementation

### Component Hierarchy

```
App
├── AppProvider (Context)
└── BrowserRouter
    └── Routes
        └── AppLayout
            ├── Header
            ├── Sidebar
            └── Content
                ├── EventsPage
                │   └── EventForm
                ├── AttendeesPage
                │   └── AttendeeForm
                └── AttendancePage
                    └── AttendanceTracker
```

### Key Components

1. **Layout.jsx**
   - Main application structure with sidebar navigation
   - Responsive design for different screen sizes

2. **EventsPage.jsx**
   - Displays all events in a sortable table
   - Provides CRUD operations for events
   - Uses modal forms for adding/editing events

3. **AttendeesPage.jsx**
   - Manages all attendee records
   - Provides CRUD operations for attendees
   - Uses modal forms for adding/editing attendees

4. **AttendanceTracker.jsx**
   - Core component for tracking attendance
   - Allows selecting events and managing attendees
   - Provides real-time attendance status updates

### Forms

1. **EventForm.jsx**
   - Form for creating and editing events
   - Validates input fields
   - Uses Ant Design's Form and DatePicker components

2. **AttendeeForm.jsx**
   - Form for creating and editing attendees
   - Validates email format and required fields
   - Prevents duplicate email addresses

## Backend Implementation

### Server Initialization

The server sets up Express with necessary middleware and initializes the data files if they don't exist.

### API Endpoints Implementation

#### Events Endpoints

- **GET /api/events**: Retrieves all events from events.json
- **GET /api/events/:id**: Finds an event by ID
- **POST /api/events**: Creates a new event with validation
- **PUT /api/events/:id**: Updates an existing event
- **DELETE /api/events/:id**: Removes an event and related attendance records

#### Attendees Endpoints

- **GET /api/attendees**: Retrieves all attendees
- **GET /api/attendees/:id**: Finds an attendee by ID
- **POST /api/attendees**: Creates a new attendee with email uniqueness validation
- **PUT /api/attendees/:id**: Updates an existing attendee
- **DELETE /api/attendees/:id**: Removes an attendee and related attendance records

#### Attendance Endpoints

- **GET /api/events/:eventId/attendance**: Retrieves attendance for a specific event
- **POST /api/attendance**: Records or updates attendance status
- **DELETE /api/attendance/:id**: Removes an attendance record
- **GET /api/events/:eventId/unregistered-attendees**: Finds attendees not registered for a specific event

### Error Handling

The server implements comprehensive error handling:
- Input validation for required fields
- Duplicate detection for emails
- Resource existence verification
- Proper HTTP status codes for different error scenarios

## State Management

The application uses React's Context API for global state management through `AppContext.jsx`. This provides:

- Centralized data store for events, attendees, and attendance records
- Loading states for async operations
- Error handling and display through Ant Design message components
- Cached data to minimize API requests

Key context functions include:
- Data fetching methods (fetchEvents, fetchAttendees, fetchEventAttendance)
- CRUD operations that update both the server and local state
- Current event selection for the attendance tracker

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd attendance-system
```

2. Install dependencies for all parts of the application:
```
npm run install-deps
```

This will install dependencies for the root project, client, and server.

### Running the Application

Start both the client and server concurrently:
```
npm run dev
```

- Frontend will be available at: http://localhost:5173
- Backend API will be available at: http://localhost:3000

### Development Mode

To run the frontend and backend separately:

1. Start the server:
```
cd server
npm run dev
```

2. Start the client (in a new terminal):
```
cd client
npm run dev
```

## API Reference

### Events

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/events` | GET | Get all events | - | Array of event objects |
| `/api/events/:id` | GET | Get event by ID | - | Event object |
| `/api/events` | POST | Create new event | `{title, date, location, description}` | Created event object |
| `/api/events/:id` | PUT | Update event | `{title, date, location, description}` | Updated event object |
| `/api/events/:id` | DELETE | Delete event | - | Success message |

### Attendees

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/attendees` | GET | Get all attendees | - | Array of attendee objects |
| `/api/attendees/:id` | GET | Get attendee by ID | - | Attendee object |
| `/api/attendees` | POST | Create new attendee | `{name, email, phone}` | Created attendee object |
| `/api/attendees/:id` | PUT | Update attendee | `{name, email, phone}` | Updated attendee object |
| `/api/attendees/:id` | DELETE | Delete attendee | - | Success message |

### Attendance

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/events/:eventId/attendance` | GET | Get attendance for event | - | Array of attendance records with attendee info |
| `/api/attendance` | POST | Record attendance | `{event_id, attendee_id, status}` | Created/updated attendance record |
| `/api/attendance/:id` | DELETE | Delete attendance record | - | Success message |
| `/api/events/:eventId/unregistered-attendees` | GET | Get unregistered attendees | - | Array of attendee objects |

## Component Guide

### Creating an Event

1. Navigate to the Events page
2. Click "Add Event" button
3. Fill in the event details (title and date are required)
4. Click "Create Event"

### Managing Attendees

1. Navigate to the Attendees page
2. View existing attendees in the table
3. Use "Add Attendee" to create new entries
4. Use edit/delete actions to modify records

### Recording Attendance

1. Navigate to the Attendance page
2. Select an event from the dropdown
3. View current attendance records
4. Mark attendees as present/absent using action buttons
5. Add new attendees to the event using "Add Attendees" button

## License

[MIT](LICENSE)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.