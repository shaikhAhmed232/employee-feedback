import { createContext, useContext, useState, useEffect } from 'react';
import { getFeedbacks, createFeedback, deleteFeedback, markFeedbackAsReviewed } from '../services/feedbackService';
import { getCategories } from '../services/categoryService';

// Create Feedback Context
const FeedbackContext = createContext(null);

// Context Provider component
export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Fetch feedbacks and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data || []);
        
        // Fetch feedbacks
        const response = await getFeedbacks(selectedCategory || null);
        setFeedbacks(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory]);
  
  // Filter feedbacks by category
  const filterFeedbacks = async (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Add new feedback - handles both authenticated and anonymous submissions
  const addFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      setError(null);
      // Handle both authenticated and anonymous feedback
      const response = await createFeedback(feedbackData);
      setFeedbacks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove feedback
  const removeFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteFeedback(feedbackId);
      setFeedbacks(prev => prev.filter(feedback => feedback._id !== feedbackId));
    } catch (err) {
      setError(err.message || 'Failed to delete feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Mark feedback as reviewed
  const reviewFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await markFeedbackAsReviewed(feedbackId);
      setFeedbacks(prev => 
        prev.map(feedback => 
          feedback._id === feedbackId ? { ...feedback, reviewed: true } : feedback
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to mark feedback as reviewed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh feedbacks
  const refreshFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFeedbacks(selectedCategory || null);
      setFeedbacks(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to refresh feedbacks');
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    feedbacks,
    categories,
    loading,
    error,
    selectedCategory,
    filterFeedbacks,
    addFeedback,
    removeFeedback,
    reviewFeedback,
    refreshFeedbacks
  };
  
  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook to use the feedback context
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export default FeedbackContext;