import React from 'react';
import Paper from '@mui/material/Paper';

const PaperLayout = ({ children }) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        padding: '24px',      
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        gap: '10px',        
        // height: 240            
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperLayout;
