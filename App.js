import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/routes/AppNavigator';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/Store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
