import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
}

const initialCategories: BudgetCategory[] = [
  {
    id: 1,
    name: 'Housing',
    allocated: 2000,
    spent: 1800,
  },
  {
    id: 2,
    name: 'Food',
    allocated: 800,
    spent: 600,
  },
  {
    id: 3,
    name: 'Transport',
    allocated: 400,
    spent: 350,
  },
  {
    id: 4,
    name: 'Entertainment',
    allocated: 300,
    spent: 250,
  },
];

const Budget = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({});

  const handleOpen = () => {
    setEditingCategory(null);
    setNewCategory({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (category: BudgetCategory) => {
    setEditingCategory(category);
    setNewCategory(category);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: newCategory.name || c.name,
                allocated: Number(newCategory.allocated) || c.allocated,
                spent: Number(newCategory.spent) || c.spent,
              }
            : c
        )
      );
    } else {
      const newId = Math.max(...categories.map((c) => c.id)) + 1;
      setCategories([
        ...categories,
        {
          id: newId,
          name: newCategory.name || '',
          allocated: Number(newCategory.allocated) || 0,
          spent: Number(newCategory.spent) || 0,
        },
      ]);
    }
    handleClose();
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Budget</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Budget Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Allocated: ${totalAllocated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spent: ${totalSpent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining: ${totalAllocated - totalSpent}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(totalSpent / totalAllocated) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            {categories.map((category) => (
              <Box key={category.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">{category.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ${category.spent} / ${category.allocated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {((category.spent / category.allocated) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(category.spent / category.allocated) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <TextField
              label="Allocated Amount"
              type="number"
              value={newCategory.allocated}
              onChange={(e) => setNewCategory({ ...newCategory, allocated: e.target.value })}
            />
            <TextField
              label="Spent Amount"
              type="number"
              value={newCategory.spent}
              onChange={(e) => setNewCategory({ ...newCategory, spent: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingCategory ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Budget; 