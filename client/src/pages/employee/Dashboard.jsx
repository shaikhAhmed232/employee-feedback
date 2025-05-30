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
  InputLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFeedback } from '../../context/FeedbackContext';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { feedbacks, loading, error, categories, filterFeedbacks } = useFeedback();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Filter feedbacks to only show those submitted by the current user
  const userFeedbacks = feedbacks.filter(feedback => feedback.employeeId === user?.id || feedback.userId === user?.id);
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterFeedbacks(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Feedback
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/feedback/new')}
          >
            Submit New Feedback
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-select-label">Filter by Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Filter by Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : userFeedbacks.length > 0 ? (
          <Grid container spacing={3}>
            {userFeedbacks.map((feedback) => (
              <Grid item xs={12} key={feedback.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {feedback.title || 'Untitled Feedback'}
                      </Typography>
                      <Chip 
                        label={feedback.reviewed ? 'Reviewed' : 'Pending'} 
                        color={feedback.reviewed ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Submitted on {formatDate(feedback.createdAt)}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                      {feedback.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {feedback.category && (
                        <Chip 
                          label={categories.find(c => c.id === feedback.categoryId)?.name || 'Unknown Category'} 
                          color="primary" 
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              You haven't submitted any feedback yet
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/feedback/new')}
            >
              Submit Your First Feedback
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EmployeeDashboard;