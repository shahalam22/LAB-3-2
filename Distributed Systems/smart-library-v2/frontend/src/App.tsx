import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  AppBar, 
  Container, 
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper
} from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { BookService } from './components/BookService';
import { UserService } from './components/UserService';
import { LoanService } from './components/LoanService';
import ErrorBoundary from './components/ErrorBoundary';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 3 }}>
            {children}
          </Paper>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3} 
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" elevation={0}>
              <Container maxWidth="lg">
                <Box sx={{ py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LibraryBooksIcon sx={{ fontSize: 40 }} />
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                    Smart Library System
                  </Typography>
                </Box>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  textColor="inherit"
                  indicatorColor="secondary"
                  sx={{ mb: 1 }}
                >
                  <Tab icon={<MenuBookIcon />} label="Books" iconPosition="start" />
                  <Tab icon={<PeopleIcon />} label="Users" iconPosition="start" />
                  <Tab icon={<LibraryBooksIcon />} label="Loans" iconPosition="start" />
                </Tabs>
              </Container>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
              <TabPanel value={currentTab} index={0}>
                <Paper elevation={0} className="paper-container">
                  <BookService />
                </Paper>
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <Paper elevation={0} className="paper-container">
                  <UserService />
                </Paper>
              </TabPanel>
              <TabPanel value={currentTab} index={2}>
                <Paper elevation={0} className="paper-container">
                  <LoanService />
                </Paper>
              </TabPanel>
            </Container>
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
