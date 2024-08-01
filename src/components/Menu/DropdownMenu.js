import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSearchFields,
  selectEntityAsync,
} from '../../features/entities/entitiesSlice';
import { APP_TYPES } from '../../constants/types';
import { clearData } from '../../features/entities/searchSlice';

const organizeDataByType = (data) => {
  if (!data || data.length === 0) {
    return {};
  }

  return data.reduce((acc, entity) => {
    const type = entity.type || 'Type 2';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(entity);
    return acc;
  }, {});
};

const DropdownMenu = ({ setFormData, setSelected }) => {
  const [menuData, setMenuData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchors, setSubMenuAnchors] = useState({});

  const { entities } = useSelector((state) => state.entities);
  const displayName = useSelector(
    (state) => state?.entities?.selectedEntity?.displayName
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Mock fetching menu data
    const fetchData = async () => {
      const res = entities.resultData;
      const datas = organizeDataByType(res);
      console.log(datas, 'organizeDataByType');
      setMenuData(organizeDataByType(res));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchors({});
  };

  const handleSubmenuOpen = (type, event) => {
    setSubMenuAnchors((prev) => ({ ...prev, [type]: event.currentTarget }));
  };

  const handleSubmenuClose = (type) => {
    setSubMenuAnchors((prev) => ({ ...prev, [type]: null }));
  };

  const handleSelection = (entity) => {
    // console.log('Selected Entity:', entity);
    // Clear the data before selecting the new entity
    dispatch(clearData());
    // clear form data
    setFormData({});
    // clear search fields
    dispatch(clearSearchFields());
    // clear selected document
    setSelected([]);
    // dispach to redux
    dispatch(selectEntityAsync(entity));
    handleClose();
  };

  const renderMenuItems = (type, items) => {
    return items.map((item) => (
      <MenuItem key={item.displayName} onClick={() => handleSelection(item)}>
        {item.displayName}
      </MenuItem>
    ));
  };

  // Sort keys so that types with only one item come first
  const sortedMenuKeys = Object.keys(menuData).sort((a, b) => {
    return menuData[a].length - menuData[b].length;
  });

  // Refactor:
  const getDisplayText = (name) => {
    if (!name) return 'Select';
    return name === APP_TYPES.FCI ? name : `${APP_TYPES.FNCA} - ${name}`;
  };

  const displayText = getDisplayText(displayName);

  return (
    <div>
      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
        {'Document Type'}
      </Typography>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        endIcon={anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        variant="outlined"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          // width: '100%',
          // maxWidth: "240px",
          minWidth: '120px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          borderColor: 'rgba(0, 0, 0, 0.23)',
          '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.87)',
          },
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {displayText}
        </Typography>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        {sortedMenuKeys.map((type) => (
          <div key={type}>
            {menuData[type].length > 1 ? (
              <>
                <MenuItem
                  onMouseOver={(event) => handleSubmenuOpen(type, event)}
                  onClick={(event) => handleSubmenuOpen(type, event)}
                >
                  {type}
                  <ChevronRightIcon />
                </MenuItem>
                <Menu
                  anchorEl={subMenuAnchors[type]}
                  open={Boolean(subMenuAnchors[type])}
                  onClose={() => handleSubmenuClose(type)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  MenuListProps={{
                    onMouseLeave: () => handleSubmenuClose(type),
                  }}
                >
                  {renderMenuItems(type, menuData[type])}
                </Menu>
              </>
            ) : (
              <MenuItem onClick={() => handleSelection(menuData[type][0])}>
                {menuData[type][0].displayName || type}
              </MenuItem>
            )}
          </div>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenu;
