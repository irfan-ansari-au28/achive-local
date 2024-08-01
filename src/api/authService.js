import API from 'axios';



// Save tokens to localStorage
const saveTokens = (tokens) => {
    // Assuming tokens are returned as an object { accessToken, refreshToken }
    localStorage.setItem('authToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
};

// Clear tokens from localStorage
const clearTokens = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
};

export const login = async (username, password) => {
    try {
        const response = await API.post('/login', { username, password });
        saveTokens(response.data);  // Expecting response.data to be { accessToken, refreshToken }
        return response.data;
    } catch (error) {
        console.error('Login Error:', error.response ? error.response.data : error);
        throw error;  // Rethrowing the error to handle it in the UI
    }
};

export const logout = () => {
    clearTokens();
    // Optionally add server notification here, if your server requires explicit logout
};

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await API.post('/refresh', { refreshToken });
        saveTokens(response.data);  // Assuming the response includes new tokens
        return response.data.accessToken;
    } catch (error) {
        console.error('Refresh Token Error:', error.response ? error.response.data : error);
        clearTokens();  // Clear tokens if refresh fails
        throw error;  // Rethrowing the error to handle it appropriately in the UI
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};
