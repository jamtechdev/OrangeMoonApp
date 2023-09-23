/* eslint-disable prettier/prettier */
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import theme from './src/utils/_css/theme';


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <PaperProvider theme={theme}>
              <AppNavigator />
      </PaperProvider>
    </PersistGate>
    </Provider>
  );
}
