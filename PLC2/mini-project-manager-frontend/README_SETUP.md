# Mini Project Manager - Frontend

A modern React + TypeScript frontend application for managing projects and tasks, built with Material-UI.

## Features

- **Authentication**: Login and Register with JWT token management
- **Dashboard**: View all your projects at a glance
- **Project Management**: Create and delete projects
- **Task Management**: Add, update, delete, and toggle task completion
- **Form Validation**: Client-side validation with react-hook-form and yup
- **Modern UI**: Clean and responsive design with Material-UI components

## Tech Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **TanStack Query (React Query)** for data fetching and caching
- **Axios** for API calls
- **React Hook Form** with Yup for form validation
- **date-fns** for date formatting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

The API base URL is configured in `src/api/client.ts`. By default, it points to:
```
http://localhost:5000/api
```

If your backend runs on a different port, update this URL accordingly.

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The app will automatically reload when you make changes.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── api/                    # API client and service functions
│   ├── client.ts          # Axios instance with interceptors
│   └── services.ts        # API service methods
├── components/            # Reusable components
│   └── Layout.tsx         # Main layout with navigation
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── pages/                 # Page components
│   ├── auth/             # Authentication pages
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/        # Dashboard page
│   │   └── Dashboard.tsx
│   └── projects/         # Project pages
│       └── ProjectDetail.tsx
├── theme/                # MUI theme configuration
│   └── theme.ts
├── types/                # TypeScript type definitions
│   └── index.ts
├── App.tsx               # Main app component with routing
└── index.tsx             # Application entry point
```

## Usage Guide

### 1. Authentication

- **Register**: Create a new account with username and password
- **Login**: Sign in with your credentials
- JWT token is stored in localStorage and automatically added to API requests

### 2. Dashboard

- View all your projects
- Create new projects with title and description
- Delete projects
- Click "View" to see project details and tasks

### 3. Project Details

- View project information
- Add new tasks with title and optional due date
- Toggle task completion by clicking the checkbox
- Edit tasks to update title, due date, or completion status
- Delete tasks

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID with tasks
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `PUT /api/tasks/:taskId/toggle` - Toggle task completion

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend API has CORS enabled for `http://localhost:3000`.

### Authentication Issues
- Check that the backend is running
- Verify the API URL in `src/api/client.ts`
- Clear localStorage if you're having token issues: `localStorage.clear()`

### Build Issues
If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` folder, ready for deployment.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Mini Project Manager application.
