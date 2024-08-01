import axios from 'axios';
import { refreshToken } from './authService';

export const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';


const API = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Add a request interceptor
API.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Add a response interceptor
API.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        // Marking that we've already tried to refresh token
        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            return API(originalRequest); // Retry the request with the new token
        } catch (refreshError) {
            // Redirect to login if token refresh fails
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default API;
