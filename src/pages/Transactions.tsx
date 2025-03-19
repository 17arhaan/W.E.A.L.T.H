import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import DeleteIcon from '@mui/icons-material/Delete';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-03-19',
    description: 'Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
  },
  {
    id: 2,
    date: '2024-03-18',
    description: 'Grocery Shopping',
    amount: 150,
    type: 'expense',
    category: 'Food',
  },
];

const categories = [
  'Salary',
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Other',
];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      const transaction: Transaction = {
        id: transactions.length + 1,
        date: newTransaction.date || new Date().toISOString().split('T')[0],
        description: newTransaction.description,
        amount: Number(newTransaction.amount),
        type: newTransaction.type as 'income' | 'expense',
        category: newTransaction.category,
      };
      setTransactions([...transactions, transaction]);
      handleClose();
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
    }
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right" sx={{
                  color: transaction.type === 'income' ? 'success.main' : 'error.main',
                }}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Date"
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            />
            <TextField
              label="Amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />
            <TextField
              select
              label="Type"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField
              select
              label="Category"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTransaction} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions; 