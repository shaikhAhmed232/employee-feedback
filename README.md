# Employee Feedback System

A full-stack application for collecting and managing employee feedback within an organization.

## How to Run the App

### Client (Frontend)

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The client will be available at `http://localhost:5173` by default

### Server (Backend)

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/employee-feedback
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm start
   ```

5. For development with auto-restart:
   ```
   npm run dev
   ```

## API Structure

### Authentication Endpoints

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - User login
- **GET /api/auth/me** - Get current user

### Feedback Endpoints

- **GET /api/feedback** - Get all feedback (admin only)
- **GET /api/feedback/:id** - Get specific feedback (admin only)
- **POST /api/feedback** - Create new feedback
- **PUT /api/feedback/:id** - Update feedback (admin only)
- **DELETE /api/feedback/:id** - Delete feedback (admin only)
- **PUT /api/feedback/:id/review** - Mark feedback as reviewed (admin only)

### Category Endpoints

- **GET /api/categories** - Get all categories
- **GET /api/categories/:id** - Get specific category
- **POST /api/categories** - Create new category (admin only)
- **PUT /api/categories/:id** - Update category (admin only)
- **DELETE /api/categories/:id** - Delete category (admin only)

## Assumptions Made

1. **User Roles**: There are two primary user roles - regular employees and administrators.

2. **Authentication**: JWT-based authentication is implemented for secure access.

3. **Anonymous Feedback**: Employees can submit feedback anonymously if desired.

4. **Categories**: Feedback is organized by categories for better management.

5. **Review Process**: Administrators can mark feedback as reviewed once processed.

6. **Database**: MongoDB is used as the database for storing all application data.

7. **Frontend Framework**: React with Material-UI is used for the frontend interface.

## Completion Status

### Completed Features

- ✅ User authentication system
- ✅ Feedback submission form for employees
- ✅ Admin dashboard for feedback management
- ✅ Category management system
- ✅ Feedback filtering and sorting functionality
- ✅ Responsive UI design

### Pending Features

- ⏳ Managing feedback for logged in user
- ⏳ Get feedback by id from client