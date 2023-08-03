/* eslint-disable prettier/prettier */
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';

import rootReducer from './reducers'; // Replace with your actual root reducer

// Redux Persist configuration
const persistConfig = {
    key: 'OrangeMoon',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with thunk middleware and logger
export const store = createStore(
    persistedReducer,
    applyMiddleware(thunk, createLogger())
);

// Create persistor
export const persistor = persistStore(store);


