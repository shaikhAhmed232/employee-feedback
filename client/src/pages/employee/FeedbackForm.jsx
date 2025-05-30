import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFeedback } from '../../context/FeedbackContext';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { categories, addFeedback, loading: categoriesLoading } = useFeedback();
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Feedback content is required';
    if (!formData.categoryId) newErrors.categoryId = 'Please select a category';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await addFeedback(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submit Feedback
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Feedback Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title || ''}
            disabled={isSubmitting}
          />
          
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!errors.categoryId}
            disabled={isSubmitting || categoriesLoading}
          >
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleChange}
            >
              {categoriesLoading ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.categoryId && (
              <Typography color="error" variant="caption">
                {errors.categoryId}
              </Typography>
            )}
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="content"
            label="Feedback Content"
            name="content"
            multiline
            rows={6}
            value={formData.content}
            onChange={handleChange}
            error={!!errors.content}
            helperText={errors.content || ''}
            disabled={isSubmitting}
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Feedback'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;