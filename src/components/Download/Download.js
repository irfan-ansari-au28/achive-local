import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StatusTable from '../Status/StatusTable';
import { fetchDownloadStatusAsync } from '../../features/entities/downloadSlice';
import { useDispatch, useSelector } from 'react-redux';

const DownloadStatus = () => {
  const [open, setOpen] = React.useState(true);

  const { statusData, status, error } = useSelector((state) => state.downloads);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDownloadStatusAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefreshClick = () => {
    dispatch(fetchDownloadStatusAsync());
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (status && status === 'loading') return <CircularProgress />;
  if (error) {
    return (
      <Typography color="error" variant="body2">
        Error: {(error?.message) || 'Something went wrong!'}
      </Typography>
    );
  }

  return (
    <>
      {statusData.length > 0 && open && (
        <Alert
          onClose={handleClose}
          severity="warning"
          sx={{
            width: '100%',
            color: 'black',
            // border: '1px solid yellow',
          }}
        >
          Please note : Download link will expire after 24 hours.
        </Alert>
      )}

      <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h2" component="h1" color={'#4A4A4A'}>
                Download Status
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshClick}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
        <StatusTable />
      </Container>
    </>
  );
};

export default DownloadStatus;
