import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { ArrowBack, DeleteOutline, CheckCircleOutline } from '@mui/icons-material';
import { useFeedback } from '../../context/FeedbackContext';

const FeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    feedbacks, 
    categories, 
    loading, 
    error,
    removeFeedback,
    reviewFeedback
  } = useFeedback();
  
  const [feedback, setFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  
  // Find the feedback by ID
  useEffect(() => {
    if (feedbacks.length > 0) {
      const foundFeedback = feedbacks.find(f => f.id === id);
      setFeedback(foundFeedback || null);
    }
  }, [feedbacks, id]);
  
  const handleMarkAsReviewed = async () => {
    try {
      setActionLoading(true);
      setActionError('');
      await reviewFeedback(id);
      // Update local state
      setFeedback(prev => prev ? { ...prev, reviewed: true } : null);
    } catch (err) {
      console.error('Error marking feedback as reviewed:', err);
      setActionError('Failed to mark feedback as reviewed');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        setActionError('');
        await removeFeedback(id);
        navigate('/admin');
      } catch (err) {
        console.error('Error deleting feedback:', err);
        setActionError('Failed to delete feedback');
      } finally {
        setActionLoading(false);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  if (!feedback) {
    return <Alert severity="warning">Feedback not found</Alert>;
  }
  
  // Find category name
  const category = categories.find(c => c.id === feedback.categoryId);
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin')}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          
          <Box>
            {!feedback.reviewed && (
              <Tooltip title="Mark as Reviewed">
                <IconButton 
                  color="success" 
                  onClick={handleMarkAsReviewed}
                  disabled={actionLoading}
                >
                  <CheckCircleOutline />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete Feedback">
              <IconButton 
                color="error" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {actionError && <Alert severity="error" sx={{ mb: 3 }}>{actionError}</Alert>}
        
        <Typography variant="h4" component="h1" gutterBottom>
          {feedback.title || 'Untitled Feedback'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            label={feedback.reviewed ? 'Reviewed' : 'Pending Review'} 
            color={feedback.reviewed ? 'success' : 'warning'}
          />
          {category && <Chip label={category.name} color="primary" />}
          <Typography variant="body2" color="text.secondary">
            Submitted on {formatDate(feedback.createdAt)}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Feedback Content</Typography>
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
              {feedback.content}
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Submitted By</Typography>
          <Typography variant="body1">
            {feedback.employeeName || 'Anonymous'}
            {feedback.employeeEmail && ` (${feedback.employeeEmail})`}
          </Typography>
        </Box>
        
      </Paper>
    </Container>
  );
};

export default FeedbackDetail;