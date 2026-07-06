import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import SplashScreen from '../screens/AuthScreens/SplashScreen';
import RoleSelection from '../screens/AuthScreens/RoleSelection';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import VerifyAccount from '../screens/AuthScreens/VerifyAccount';
import OTP from '../screens/AuthScreens/OTP';
import SetPassword from '../screens/AuthScreens/SetPassword';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="SetPassword" component={SetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
