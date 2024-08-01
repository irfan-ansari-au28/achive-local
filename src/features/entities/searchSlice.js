import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchEntityData = createAsyncThunk(
  'entity/fetchData',
  async ({ entityName, page=0, size=50, sortBy, sortOrder, body }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/v1/entity/${entityName}/search`, body, {
        params: { page, size, sortBy, sortOrder }
      });
      // console.log('entity', response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }  
);

const entitySlice = createSlice({
  name: 'entity',
  initialState: {
    data: [],
    pageDetails: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.pageDetails = {};
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntityData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntityData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.pageDetails = action.payload.page;
        state.error = null
      })
      .addCase(fetchEntityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearData } = entitySlice.actions;

export const { reducer } = entitySlice;
export default reducer;
