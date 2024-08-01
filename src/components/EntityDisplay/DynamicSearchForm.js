import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, TextField, Button, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchEntityData } from '../../features/entities/searchSlice';
import { setSearchFields } from '../../features/entities/entitiesSlice';
import { debounce } from '../../utils/debounce';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  constructPayload,
  deserializeDate,
  serializeDate,
  validatePayload,
} from '../../utils/helper';
import { dateFields } from '../../constants/types';

const DynamicSearchForm = ({ onSubmit, formData, setFormData }) => {
  const dispatch = useDispatch();

  // Filtering only search fields where isForSearch is true
  const searchFields = useSelector(
    (state) =>
      state.entities.selectedEntity.searchFields.filter(
        (field) => field.isForSearch
      ) // Change here to filter by isForSearch
  );

  const { selectedEntity } = useSelector((state) => state.entities);
  const [formErrors, setFormErrors] = React.useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDispatchFormData = useCallback(
    debounce((newFormData) => {
      dispatch(setSearchFields(newFormData));
    }, 300),
    [dispatch]
  );

   //// REFACTOR : LOGIC FOR VALIDATION
  const validate = (data) => {
    let errors = {};
  
    // Validate each field based on its settings
    searchFields.forEach(field => {
      const value = data[field.displayName];
      validateMandatoryField(field, value, errors);
      validateDataType(field, value, errors);
    });
  
    // Validate date ranges
    validateDateRanges(data, errors);
  
    return errors;
  };
  
  // Validate mandatory fields
  const validateMandatoryField = (field, value, errors) => {
    if (field.isMandatory && !value) {
      errors[field.displayName] = 'This field is required';
    }
  };
  
  // Validate data types and constraints
  const validateDataType = (field, value, errors) => {
    if (value) {
      if (field.dataType.toLowerCase() === 'number') {
        validateNumberField(field, value, errors);
      }
    }
  };
  
  // Validate number fields
  const validateNumberField = (field, value, errors) => {
    if (isNaN(value)) {
      errors[field.displayName] = 'Must be a number';
    } else if (value < field.minValue || value > field.maxValue) {
      errors[field.displayName] = `Must be between ${field.minValue} and ${field.maxValue}`;
    }
  };
  
  // Validate date ranges across fields
  const validateDateRanges = (data, errors) => {
    dateFields.forEach(field => {
      if (field.includes('From') || field.includes('FROM')) {
        const toDateField = field.replace('From', 'To').replace('FROM', 'TO');
        validateDateRange(field, toDateField, data, errors);
      }
    });
  };
  
  // Validate individual date range
  const validateDateRange = (fromField, toField, data, errors) => {
    const fromDate = new Date(data[fromField]);
    const toDate = new Date(data[toField]);
  
    if (fromDate > toDate) {
      errors[fromField] = `"From" date must not be later than "To" date`;
      errors[toField] = `"To" date must not be earlier than "From" date`;
    }
  };
  

  const handleChange = (displayName, value) => {
    // Changed parameter from fieldName to displayName
    const field = searchFields.find(
      (field) => field.displayName === displayName
    );
    const formattedValue =
      field.dataType === 'date' ? serializeDate(value) : value;

    setFormData((prev) => ({
      ...prev,
      [displayName]: formattedValue, // Changed from fieldName to displayName
    }));

    const newErrors = { ...formErrors };
    if (field.isMandatory && !value) {
      newErrors[displayName] = 'This field is required'; // Changed from fieldName to displayName
    } else {
      delete newErrors[displayName]; // Changed from fieldName to displayName
    }
    setFormErrors(newErrors);

    debounceDispatchFormData({
      ...formData,
      [displayName]: formattedValue, // Changed from fieldName to displayName
    });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);
    const errors = validate(formData);
    if (Object.keys(errors).length === 0) {
      // Show the table
      onSubmit(true);
      // Constructing the searchCriteria object
      const payload = constructPayload(formData);
      // validate payload
      const searchCriteria = validatePayload(payload);

      // Dispatching the fetchEntityData with the new payload structure
      dispatch(
        fetchEntityData({
          entityName: selectedEntity.entityName,
          body: {
            searchCriteria,
          },
        })
      );
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Grid container spacing={2} alignItems="center">
          {searchFields.map((field) => (
            <Grid
              item
              xs
              key={field.displayName} // Changed from fieldName to displayName for key
              sx={{
                minWidth: {
                  xs: '120px',
                  sm: '240px',
                },
                marginTop: '10px',
                maxWidth: '240px',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {field.displayName}
                {field.isMandatory && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              {field.dataType.toLowerCase() === 'date' ? (
                <DatePicker
                  value={deserializeDate(formData[field.displayName]) || null} // Changed from fieldName to displayName
                  onChange={
                    (newValue) => handleChange(field.displayName, newValue) // Changed from fieldName to displayName
                  }
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      size: 'small',
                      error: !!formErrors[field.displayName], // Changed from fieldName to displayName
                      helperText: formErrors[field.displayName] || ' ', // Changed from fieldName to displayName
                      fullWidth: true,
                    },
                  }}
                />
              ) : (
                <TextField
                  value={formData[field.displayName] || ''} // Changed from fieldName to displayName
                  onChange={
                    (e) => handleChange(field.displayName, e.target.value) // Changed from fieldName to displayName
                  }
                  type={field.dataType.toLowerCase() || 'text'}
                  required={field.isMandatory}
                  error={!!formErrors[field.displayName]} // Changed from fieldName to displayName
                  helperText={formErrors[field.displayName] || ' '} // Changed from fieldName to displayName
                  InputProps={{
                    placeholder: `${field.displayName}`,
                    style: { color: '#555770' },
                  }}
                />
              )}
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default DynamicSearchForm;
