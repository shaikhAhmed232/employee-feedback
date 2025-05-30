import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, CssBaseline } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{ p: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}
      >
        <Container maxWidth="sm">
          <Box textAlign="center">
            Employee Feedback System &copy; {new Date().getFullYear()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;