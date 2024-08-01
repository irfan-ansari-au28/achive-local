import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {fetchAllEntities} from '../../api/apiService'

// Async thunk for fetching entities
export const fetchEntities = createAsyncThunk(
  'entities/fetchEntities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllEntities()
      return response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for selecting an entity (if you need async operations)
export const selectEntityAsync = createAsyncThunk(
  'entities/selectEntityAsync',
  async (entity, { dispatch }) => {
    // Perform any async operations here if needed
    dispatch(setSelectedEntity(entity));
    return entity;
  }
);

const entitiesSlice = createSlice({
  name: 'entities',
  initialState: {
    entities: [],
    searchFields: {}, 
    selectedEntity: null,
    downloadNotification: false,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedEntity: (state, action) => {
        state.selectedEntity = action.payload;
    },
    setSearchFields: (state, action) => {  
      state.searchFields = action.payload;
    },
    setDownloadNotification: (state, action) => {
      state.downloadNotification = action.payload
    },
    clearSearchFields: (state) => {
      state.searchFields = {}; // Clear the search fields
    },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedEntity, setSearchFields, setDownloadNotification, clearSearchFields } = entitiesSlice.actions;


export default entitiesSlice.reducer;
