import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { ArrowBack, Add, Delete, Edit } from '@mui/icons-material';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await createCategory({ name: newCategoryName.trim() });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory || !editCategory.name.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      // Update category API call
      const response = await updateCategory(editCategory.id, { name: editCategory.name.trim() });
      // Update local state
      setCategories(categories.map(cat => cat.id === editCategory.id ? response.data : cat));
      setEditCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDialogOpen(true);
  };
  
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      setDialogOpen(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      // Delete category API call
      await deleteCategory(categoryToDelete.id);
      // Update local state
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
      setDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };
  
  const startEditCategory = (category) => {
    setEditCategory({ ...category });
  };
  
  const cancelEditCategory = () => {
    setEditCategory(null);
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => navigate('/admin')} 
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Manage Categories
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {/* Add/Edit Category Form */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {editCategory ? 'Edit Category' : 'Add New Category'}
          </Typography>
          
          <Box component="form" onSubmit={editCategory ? handleUpdateCategory : handleAddCategory}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                variant="outlined"
                value={editCategory ? editCategory.name : newCategoryName}
                onChange={e => editCategory 
                  ? setEditCategory({ ...editCategory, name: e.target.value })
                  : setNewCategoryName(e.target.value)
                }
                disabled={loading}
                required
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={editCategory ? <Edit /> : <Add />}
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (editCategory ? 'Update' : 'Add')}
              </Button>
              {editCategory && (
                <Button
                  variant="outlined"
                  onClick={cancelEditCategory}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
        
        {/* Categories List */}
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Existing Categories
        </Typography>
        
        {loading && !editCategory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : categories.length > 0 ? (
          <List>
            {categories.map((category, index) => (
              <Box key={category.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => startEditCategory(category)}
                        disabled={loading || !!editCategory}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => confirmDeleteCategory(category)}
                        disabled={loading}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={category.name}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Alert severity="info">No categories found. Add your first category above.</Alert>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? 
            This action cannot be undone, and any feedback associated with this category will be uncategorized.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error" disabled={loading} autoFocus>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryManagement;