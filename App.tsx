/* eslint-disable prettier/prettier */
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
              <AppNavigator />
      </PaperProvider>
    </PersistGate>
    </Provider>
  );
}
