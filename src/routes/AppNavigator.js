import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/Slices';
import { connectSocket, disconnectSocket } from '../utils/Socket';

// Flow Navigators
import AuthStack from './AuthStack';
import ProviderStack from './ProviderTabs';
import StaffStack from './StaffTabs';

const RootStack = createStackNavigator();

const AppNavigator = () => {
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <RootStack.Screen name="Auth" component={AuthStack} />

        {/* Provider Flow (with Bottom Tabs) */}
        <RootStack.Screen name="ProviderTabs" component={ProviderStack} />

        {/* Staff Flow (with Bottom Tabs) */}
        <RootStack.Screen name="StaffTabs" component={StaffStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
