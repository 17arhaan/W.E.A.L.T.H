import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400, savings: 1600 },
  { name: 'Feb', income: 3000, expenses: 1398, savings: 1602 },
  { name: 'Mar', income: 2000, expenses: 9800, savings: -7800 },
  { name: 'Apr', income: 2780, expenses: 3908, savings: -1128 },
  { name: 'May', income: 1890, expenses: 4800, savings: -2910 },
  { name: 'Jun', income: 2390, expenses: 3800, savings: -1410 },
];

const categoryData = [
  { name: 'Housing', value: 400 },
  { name: 'Food', value: 300 },
  { name: 'Transport', value: 200 },
  { name: 'Entertainment', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select defaultValue="6" label="Time Period">
            <MenuItem value="3">Last 3 months</MenuItem>
            <MenuItem value="6">Last 6 months</MenuItem>
            <MenuItem value="12">Last 12 months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Income vs Expenses Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                  <Line type="monotone" dataKey="savings" stroke="#ffc658" name="Savings" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#8884d8" name="Income" />
                  <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Expense Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expense Categories
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="subtitle2">Average Monthly Income</Typography>
                  <Typography variant="h6">$2,678</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white' }}>
                  <Typography variant="subtitle2">Average Monthly Expenses</Typography>
                  <Typography variant="h6">$4,351</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                  <Typography variant="subtitle2">Highest Savings Month</Typography>
                  <Typography variant="h6">February</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'white' }}>
                  <Typography variant="subtitle2">Highest Expense Month</Typography>
                  <Typography variant="h6">March</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 