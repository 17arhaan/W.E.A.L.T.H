import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          W.E.A.L.T.H
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/transactions"
            startIcon={<ReceiptIcon />}
          >
            Transactions
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/budget"
            startIcon={<AccountBalanceWalletIcon />}
          >
            Budget
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/analytics"
            startIcon={<AnalyticsIcon />}
          >
            Analytics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 