import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDownloadStatus } from '../../api/apiService'; // Adjust the path to match your project structure


export const fetchDownloadStatusAsync = createAsyncThunk(
    'downloads/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchDownloadStatus();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const downloadSlice = createSlice({
    name: 'downloads',
    initialState: {
        statusData: [],
        status: null, // 'Intitated', 'In Progress', 'Completed', 'failed'
        error: null
    },
    reducers: {
        setDownloadStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDownloadStatusAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDownloadStatusAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.statusData = action.payload;
                state.error = null
            })
            .addCase(fetchDownloadStatusAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setDownloadStatus } = downloadSlice.actions;
export default downloadSlice.reducer;

