# Mini Project Manager - Quick Start Guide

This guide will help you get both the backend API and frontend application running.

## Prerequisites

- .NET 8 SDK
- Node.js (v16 or higher)
- npm or yarn

## Step 1: Start the Backend API

1. Navigate to the API directory:
```bash
cd MiniProjectManager.Api
```

2. Restore dependencies (if not already done):
```bash
dotnet restore
```

3. Run database migrations:
```bash
dotnet ef database update
```

4. Start the API:
```bash
dotnet run
```

The API should now be running at `http://localhost:5000` (or `https://localhost:5001`)

**Note**: If your API runs on a different port, you'll need to update the frontend configuration.

## Step 2: Start the Frontend Application

1. Open a new terminal and navigate to the frontend directory:
```bash
cd mini-project-manager-frontend
```

2. Install dependencies (first time only):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## Step 3: Using the Application

### First Time Setup

1. **Register a new account**:
   - Click "Register" on the login page
   - Enter a username (minimum 3 characters)
   - Enter a password (minimum 6 characters)
   - Click "Register"

2. **You'll be automatically logged in** and redirected to the dashboard

### Creating Your First Project

1. On the dashboard, click **"New Project"**
2. Enter a project title (required)
3. Optionally add a description
4. Click **"Create"**

### Managing Tasks

1. Click **"View"** on any project card
2. Click **"Add Task"** to create a new task
3. Enter task details:
   - Title (required)
   - Due date (optional)
4. Click the checkbox to toggle task completion
5. Click the edit icon to modify a task
6. Click the delete icon to remove a task

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details with tasks
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `POST /api/projects/{projectId}/tasks` - Create task
- `PUT /api/tasks/{taskId}` - Update task
- `DELETE /api/tasks/{taskId}` - Delete task
- `PUT /api/tasks/{taskId}/toggle` - Toggle task completion

## Testing the API with Swagger

The backend includes Swagger UI for API testing:

1. Start the backend API
2. Navigate to: `http://localhost:5000/swagger`
3. Use the "Authorize" button to add your JWT token
4. Test endpoints directly from the browser

## Troubleshooting

### Backend Issues

**Port already in use**:
```bash
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database issues**:
```bash
# Reset database
dotnet ef database drop
dotnet ef database update
```

### Frontend Issues

**CORS errors**:
- Ensure the backend has CORS enabled for `http://localhost:3000`
- Check `Program.cs` for CORS configuration

**API connection failed**:
- Verify the backend is running
- Check the API URL in `src/api/client.ts`
- Default is `http://localhost:5000/api`

**Authentication issues**:
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear
- Try registering a new account

**Port 3000 already in use**:
```bash
# The app will prompt you to use a different port
# Or manually kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Project Structure

```
PLC2/
├── MiniProjectManager.Api/          # Backend .NET API
│   ├── Controllers/                 # API controllers
│   ├── Models/                      # Data models
│   ├── DTOs/                        # Data transfer objects
│   ├── Data/                        # Database context
│   ├── Services/                    # Business logic
│   └── Program.cs                   # App configuration
│
└── mini-project-manager-frontend/   # Frontend React app
    ├── src/
    │   ├── api/                     # API client
    │   ├── components/              # Reusable components
    │   ├── contexts/                # React contexts
    │   ├── pages/                   # Page components
    │   ├── theme/                   # MUI theme
    │   ├── types/                   # TypeScript types
    │   └── App.tsx                  # Main app component
    └── package.json
```

## Development Tips

### Backend Development

- Use `dotnet watch run` for hot reload during development
- Check logs in the console for debugging
- Use Swagger UI for API testing

### Frontend Development

- React DevTools extension is helpful for debugging
- Use browser DevTools Network tab to inspect API calls
- Check Console for errors and warnings

## Production Deployment

### Backend
```bash
cd MiniProjectManager.Api
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd mini-project-manager-frontend
npm run build
```

The optimized build will be in the `build/` folder.

## Additional Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Query Documentation](https://tanstack.com/query/latest)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README files in each project directory
3. Check browser console and backend logs for error messages

---

**Happy coding! 🚀**
