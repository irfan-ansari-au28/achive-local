import { Box, Grid, Typography, Alert, Container, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PaperLayout from '../PaperLayout/PaperLayout';
import DynamicSearchForm from '../EntityDisplay/DynamicSearchForm';
import DynamicTable from '../DynamicTable/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntities, setDownloadNotification } from '../../features/entities/entitiesSlice';
import DropdownMenu from '../Menu/DropdownMenu';

const Search = () => {
  const [showTable, setShowTable] = useState(false);
  const [formData, setFormData] = React.useState({});
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch()

  const {downloadNotification} = useSelector(state=>state.entities)
  const { loading, selectedEntity } = useSelector(state => state.entities); 

  useEffect(()=>{
    dispatch(fetchEntities())
  },[dispatch])

  const handleClose = () => {
    dispatch(setDownloadNotification(false))
  };
  // Hide notification after 6 sec
  useEffect(() => {
    let timer;
    if (downloadNotification) {
      timer = setTimeout(() => {
        dispatch(setDownloadNotification(false));
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [downloadNotification, dispatch]);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {downloadNotification && (
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: '#E6F3E5',
            color: 'black',
            // border: '1px solid #4EAF51',
          }}
        >
          Your documents are being downloaded. Please check the download page
          for status updates.
        </Alert>
      )}
      <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
        <Box sx={{ pb: 3 }}>
          <Typography variant="h2" component="h1" color={'#4A4A4A'}>
            Document Search
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
           <PaperLayout>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                  {/* // Option 1 Menu */}
                  {!loading && <DropdownMenu setFormData={setFormData} setSelected={setSelected} />}
                </Grid>
              </Grid>
              {selectedEntity && <DynamicSearchForm formData={formData} setFormData={setFormData} onSubmit={setShowTable}  />}
            </PaperLayout>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: '16px' }}>
          <Grid item xs={12} md={12} lg={12}>
            {showTable   && <DynamicTable selected={selected} setSelected={setSelected} />}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Search;
