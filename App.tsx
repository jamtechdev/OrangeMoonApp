/* eslint-disable prettier/prettier */
import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import {PaperProvider} from 'react-native-paper';
import theme from './src/utils/_css/theme';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid='true'
          // enableAutomaticScroll={(Platform.OS === 'ios')}
          // extraScrollHeight={Platform.select({ios: 50, android: 100})}
          >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <PaperProvider theme={theme}>
              <AppNavigator />
            </PaperProvider>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </PersistGate>
    </Provider>
  );
}
