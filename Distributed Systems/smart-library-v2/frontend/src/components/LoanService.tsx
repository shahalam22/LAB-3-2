import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  TableContainer,
  Tooltip,
  CircularProgress,
  Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import api from '../services/api';

interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  return_date: string | null;
  status: string;
}

export const LoanService: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [newLoan, setNewLoan] = useState({ user_id: '', book_id: '' });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching loans', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async () => {
    if (!newLoan.user_id || !newLoan.book_id) {
      enqueueSnackbar('Please fill in all fields', { variant: 'warning' });
      return;
    }

    try {
      await api.post('/loans', {
        user_id: parseInt(newLoan.user_id),
        book_id: parseInt(newLoan.book_id)
      });
      setNewLoan({ user_id: '', book_id: '' });
      fetchLoans();
      enqueueSnackbar('Loan created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error creating loan', { variant: 'error' });
    }
  };

  const handleReturnBook = async (loanId: number) => {
    try {
      await api.post(`/loans/returns`, { loan_id: loanId });
      fetchLoans();
      enqueueSnackbar('Book returned successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error returning book', { variant: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Create New Loan
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2 
        }}>
          <TextField
            label="User ID"
            value={newLoan.user_id}
            onChange={(e) => setNewLoan({ ...newLoan, user_id: e.target.value })}
            margin="normal"
            fullWidth
            variant="outlined"
            type="number"
          />
          <TextField
            label="Book ID"
            value={newLoan.book_id}
            onChange={(e) => setNewLoan({ ...newLoan, book_id: e.target.value })}
            margin="normal"
            fullWidth
            variant="outlined"
            type="number"
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateLoan}
            startIcon={<BookmarkAddIcon />}
          >
            Create Loan
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Loan Records
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Book ID</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No loans recorded
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id} hover>
                    <TableCell>{loan.id}</TableCell>
                    <TableCell>{loan.user_id}</TableCell>
                    <TableCell>{loan.book_id}</TableCell>
                    <TableCell>{formatDate(loan.loan_date)}</TableCell>
                    <TableCell>{formatDate(loan.return_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={loan.status}
                        color={getStatusColor(loan.status) as any}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {loan.status === 'active' && (
                        <Tooltip title="Return Book">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleReturnBook(loan.id)}
                          >
                            <AssignmentReturnIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};