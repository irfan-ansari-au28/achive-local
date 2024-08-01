import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; 

export const store = configureStore({
  reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',  // Enable Redux DevTools in development
});
