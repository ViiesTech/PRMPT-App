import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Auth Screens
import SplashScreen from '../screens/AuthScreens/SplashScreen';
import RoleSelectionScreen from '../screens/AuthScreens/RoleSelectionScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
import VerifyAccountScreen from '../screens/AuthScreens/VerifyAccountScreen';
import EmailVerificationScreen from '../screens/AuthScreens/EmailVerificationScreen';
import SetPasswordScreen from '../screens/AuthScreens/SetPasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({current, layouts}) => ({
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
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
