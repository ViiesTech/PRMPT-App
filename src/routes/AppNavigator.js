import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Flow Navigators
import AuthStack from './AuthStack';
import ProviderStack from './ProviderTabs';
import StaffStack from './StaffTabs';

const RootStack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
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
