import { createTheme } from '@mui/material/styles';
import typography from './typography';

const themes = () =>
  createTheme({
    palette: {
      primary: { main: '#E31837' },
      secondary: { main: '#C7C9D9' },
      // error: { main: '#E13232' },
      // warning: { main: '#FFB100' },
      // info: { main: '#8BC34A' },
      newColor: {
        lightGrey: '#4A4A4A',
        lightBlack: '#190134',
        redHover: '#FADFE3',
        selectValue: '#555770'
      },
    },
    typography: { ...typography },
    components: {
      // Configure the default props for MUI TextField
      MuiTextField: {
        defaultProps: {
          size: 'small', // Set TextField size to small by default
        },
      },
    },
  });

export default themes;
