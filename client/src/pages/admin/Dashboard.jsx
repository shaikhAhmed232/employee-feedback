import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from '@mui/material';
import {
  DeleteOutline,
  CheckCircleOutline,
  VisibilityOutlined,
  FilterList,
  SortByAlpha
} from '@mui/icons-material';
import { useFeedback } from '../../context/FeedbackContext';

const AdminDashboard = () => {
  const { 
    feedbacks, 
    loading, 
    error, 
    categories, 
    filterFeedbacks, 
    reviewFeedback,
    removeFeedback 
  } = useFeedback();
  const navigate = useNavigate();
  
  // States for filtering and pagination
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filter, setFilter] = useState('all'); // 'all', 'reviewed', 'pending'
  
  // Apply sorting and filtering
  const filteredFeedbacks = [...feedbacks]
    // Apply category filter first
    // Then apply reviewed status filter
    .filter(feedback => {
      if (filter === 'all') return true;
      return filter === 'reviewed' ? feedback.reviewed : !feedback.reviewed;
    })
    // Then sort
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === 'a-z') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (sortOrder === 'z-a') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });
  
  // Get current page data
  const paginatedFeedbacks = filteredFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Stats calculations
  const totalFeedbacks = feedbacks.length;
  const reviewedFeedbacks = feedbacks.filter(f => f.reviewed).length;
  const pendingFeedbacks = totalFeedbacks - reviewedFeedbacks;
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterFeedbacks(e.target.value?._id);
    setPage(0); // Reset to first page when filtering
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSortChange = () => {
    const orders = ['newest', 'oldest', 'a-z', 'z-a'];
    const currentIndex = orders.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % orders.length;
    setSortOrder(orders[nextIndex]);
  };
  
  const handleFilterChange = () => {
    const filters = ['all', 'reviewed', 'pending'];
    const currentIndex = filters.indexOf(filter);
    const nextIndex = (currentIndex + 1) % filters.length;
    setFilter(filters[nextIndex]);
  };
  
  const handleReviewFeedback = async (feedbackId) => {
    try {
      await reviewFeedback(feedbackId);
    } catch (error) {
      console.error('Error marking feedback as reviewed:', error);
    }
  };
  
  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await removeFeedback(feedbackId);
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Admin Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h5">{totalFeedbacks}</Typography>
              <Typography variant="subtitle1">Total Feedbacks</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h5">{reviewedFeedbacks}</Typography>
              <Typography variant="subtitle1">Reviewed</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <Typography variant="h5">{pendingFeedbacks}</Typography>
              <Typography variant="subtitle1">Pending</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-select-label">Filter by Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory?.name}
                label="Filter by Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Toggle filter: All/Reviewed/Pending">
              <IconButton onClick={handleFilterChange} color="primary">
                <FilterList />
              </IconButton>
            </Tooltip>
            <Chip 
              label={filter === 'all' ? 'All' : filter === 'reviewed' ? 'Reviewed' : 'Pending'} 
              color={filter === 'reviewed' ? 'success' : filter === 'pending' ? 'warning' : 'default'}
            />
            
            <Tooltip title="Toggle sort order">
              <IconButton onClick={handleSortChange} color="primary">
                <SortByAlpha />
              </IconButton>
            </Tooltip>
            <Chip 
              label={sortOrder === 'newest' ? 'Newest First' : 
                     sortOrder === 'oldest' ? 'Oldest First' :
                     sortOrder === 'a-z' ? 'A to Z' : 'Z to A'} 
            />
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/categories')}
          >
            Manage Categories
          </Button>
        </Box>
        
        {/* Feedbacks Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredFeedbacks.length > 0 ? (
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Submitted By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFeedbacks.map((feedback) => {
                    console.log(feedback);
                    const categoryName = categories.find(cat => cat._id === feedback.category?._id)?.name || 'Uncategorized';
                    
                    return (
                      <TableRow key={feedback._id}>
                        <TableCell>
                          <Chip label={categoryName} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{feedback.employeeName || 'Anonymous'}</TableCell>
                        <TableCell>{formatDate(feedback.created_at)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={feedback.reviewed ? 'Reviewed' : 'Pending'} 
                            color={feedback.reviewed ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/admin/feedback/${feedback.id}`)}
                            >
                              <VisibilityOutlined />
                            </IconButton>
                          </Tooltip>
                          {!feedback.reviewed && (
                            <Tooltip title="Mark as Reviewed">
                              <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => handleReviewFeedback(feedback._id)}
                              >
                                <CheckCircleOutline />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Feedback">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteFeedback(feedback._id)}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFeedbacks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No feedback entries found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;