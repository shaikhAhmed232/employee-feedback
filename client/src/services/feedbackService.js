import api from './api';

const ENDPOINT = '/feedback';

// Get all feedbacks with optional category filter
export const getFeedbacks = async (category) => {
  const params = category ? { category } : {};
  const response = await api.get(ENDPOINT, { params });
  return response.data;
};

// Create a new feedback
export const createFeedback = async (feedbackData) => {
  const response = await api.post(ENDPOINT, feedbackData);
  return response.data;
};

// Delete a feedback (admin only)
export const deleteFeedback = async (feedbackId) => {
  const response = await api.delete(`${ENDPOINT}/${feedbackId}`);
  return response.data;
};

// Mark feedback as reviewed (admin only)
export const markFeedbackAsReviewed = async (feedbackId) => {
  const response = await api.patch(`${ENDPOINT}/${feedbackId}/reviewed`);
  return response.data;
};