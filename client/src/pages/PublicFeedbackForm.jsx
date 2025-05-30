import { useState } from 'react';
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
import { useFeedback } from '../context/FeedbackContext';
import { httpStatusCode } from "../utils/constants";

const PublicFeedbackForm = () => {
  const [formData, setFormData] = useState({
    feedback: '',
    category: null,
    email: '' // Added email field for unauthenticated users
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  
  const { categories, addFeedback, loading: categoriesLoading } = useFeedback();
  
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
    setSubmitSuccess(false);
    
    setIsSubmitting(true);
    try {
      await addFeedback({
        ...formData,
        category: formData.category?._id,
        anonymous: true 
      });
      setSubmitSuccess(true);
      setFormData({
        feedback: '',
        category: '', // Make sure this matches the name attribute in the Select
        email: ''
      });
    } catch (error) {
      if (error.status === httpStatusCode.BAD_REQUEST) {
        let fieldToErrorMessageMap = {};
        (error.response?.data?.details || []).map((error) => {
          fieldToErrorMessageMap[error?.field] = error?.message
        })
        setErrors(fieldToErrorMessageMap);
      }
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

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your feedback! It has been submitted successfully.
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!errors.category}
            disabled={isSubmitting || categoriesLoading}
          >
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category"
              name="category"
              value={formData.category || ''}
              label="Category"
              onChange={handleChange}
            >
              {categoriesLoading ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category._id} value={category}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.category && (
              <Typography color="error" variant="caption">
                {errors.category}
              </Typography>
            )}
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            id="feedback"
            label="Feedback Content"
            name="feedback"
            multiline
            rows={6}
            value={formData.feedback}
            onChange={handleChange}
            error={!!errors.feedback}
            disabled={isSubmitting}
          />
          {errors.feedback && (
              <Typography color="error" variant="caption">
                {errors.category}
              </Typography>
            )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
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

export default PublicFeedbackForm;