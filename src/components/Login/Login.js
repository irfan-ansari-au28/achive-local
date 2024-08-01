import React from 'react';
import styles from './Login.module.css';
import backgroundImage from '../../assets/images/login-bg-min.png';
import { Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/images/cma-logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    // Placeholder for actual login logic
    try {
      console.log('Login successful');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div
      className={styles.loginContainer}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '412px',
          padding: '60px 32px',
          borderRadius: '24px',
          border: '0px solid #ADB5BD',
          background: '#FFF',
          boxShadow: '0px 4px 54px rgba(162, 181, 192, 0.16)',
        }}
      >
        <img
          src={logo}
          alt="cma Logo"
          style={{
            width: 85,
            height: 'auto',
            // marginBottom: '20px'
          }}
        />

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            mt: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            style={{
              color: theme.palette.newColor.lightGrey,
            }}
          >
            Login
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => navigate('/')}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
