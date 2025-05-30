import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import Layout from './components/Layout';
import './App.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import PublicFeedbackForm from './pages/PublicFeedbackForm';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import FeedbackForm from './pages/employee/FeedbackForm';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import FeedbackDetail from './pages/admin/FeedbackDetail';
import CategoryManagement from './pages/admin/CategoryManagement';

// Auth guard for protected routes
const PrivateRoute = ({ element, requiredRole }) => {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  
  return element;
};

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <FeedbackProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Navigate to="/feedback" />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="feedback" element={<PublicFeedbackForm />} />
                
                {/* Employee routes */}
                <Route 
                  path="dashboard" 
                  element={<PrivateRoute element={<EmployeeDashboard />} requiredRole="employee" />} 
                />
                <Route 
                  path="feedback/new" 
                  element={<PrivateRoute element={<FeedbackForm />} requiredRole="employee" />} 
                />
                
                {/* Admin routes */}
                <Route 
                  path="admin" 
                  element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />} 
                />
                <Route 
                  path="admin/feedback/:id" 
                  element={<PrivateRoute element={<FeedbackDetail />} requiredRole="admin" />} 
                />
                <Route 
                  path="admin/categories" 
                  element={<PrivateRoute element={<CategoryManagement />} requiredRole="admin" />} 
                />
                
                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FeedbackProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
