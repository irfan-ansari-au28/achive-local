import { combineReducers } from '@reduxjs/toolkit';
import entitiesReducer from './features/entities/entitiesSlice';
import entityReducer from './features/entities/searchSlice';
import downloadReducer from './features/entities/downloadSlice';

const rootReducer = combineReducers({
  entities: entitiesReducer,
  entity: entityReducer,
  downloads: downloadReducer,
  // Include other reducers here

});

export default rootReducer;
