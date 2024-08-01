import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '../../assets/icons/DownloadIcon';

export default function ListItems() {
  const location = useLocation();
  
  const getSelectedIndex = () => {
    switch (location.pathname) {
      case '/search':
        return 0;
      case '/download':
        return 1;
      default:
        return 0; // Default to the first item if the route does not match
    }
  };

  const [selectedIndex, setSelectedIndex] = React.useState(getSelectedIndex);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index); // Update the selected index state
  };

  React.useEffect(() => {
    setSelectedIndex(getSelectedIndex());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <React.Fragment>
      <ListItemButton
        component={Link}
        to="/search"
        selected={selectedIndex === 0} // Apply the selected prop
        onClick={(event) => handleListItemClick(event, 0)} // Handle click
        sx={{ marginTop: 2 }}
      >
        <ListItemIcon>
          <SearchIcon color={selectedIndex === 0 ? 'primary' : '#555770'} />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItemButton>
      <ListItemButton
        component={Link}
        to="/download"
        selected={selectedIndex === 1} // Apply the selected prop
        onClick={(event) => handleListItemClick(event, 1)} // Handle click
        sx={{ marginTop: 2 }}
      >
        <ListItemIcon>
          <DownloadIcon color={selectedIndex === 1 ? 'primary' : '#555770'} />
        </ListItemIcon>
        <ListItemText primary="Download" />
      </ListItemButton>
    </React.Fragment>
  );
}
