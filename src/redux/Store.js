import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './Slices';
import chatReducer from './ChatSlices';
import { baseApi } from '../Services/api';

// Define persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Apply persistence to reducers
const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  chat: persistReducer(persistConfig, chatReducer),
  [baseApi.reducerPath]: baseApi.reducer,
};

// Create Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
