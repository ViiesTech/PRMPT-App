import React from 'react';
import { Text, StyleSheet, View, Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppColors } from '../utils/AppColors';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from '../utils/Responsive_Dimensions';
import { AppImages } from '../assets/Images/Index';

// Staff Screens
import StaffHome from '../screens/StaffFlow/StaffHome';
import StaffQueue from '../screens/StaffFlow/StaffQueue';
import PageProvider from '../screens/StaffFlow/PageProvider';
import StaffMessages from '../screens/StaffFlow/StaffMessages';
import StaffProfile from '../screens/StaffFlow/StaffProfile';

import StaffChat from '../screens/StaffFlow/StaffChat';
import ChangePassword from '../screens/AuthScreens/ChangePassword';
import StaffEditProfile from '../screens/StaffFlow/StaffEditProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ label, icon, focused }) => (
  <View style={styles.tabIconContainer}>
    <Image
      source={icon}
      style={[
        styles.tabIcon,
        focused ? styles.tabIconActive : styles.tabIconInactive,
      ]}
      resizeMode="contain"
    />
    <Text
      style={[styles.tabLabel, focused && styles.tabLabelActive]}
      numberOfLines={1} // Prevents text from breaking into multiple lines
      ellipsizeMode="tail"
    >
      {label}
    </Text>
  </View>
);

const StaffBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true, // Prevents tab bar from floating on keyboard pop-up
      }}
    >
      <Tab.Screen
        name="Home"
        component={StaffHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" icon={AppImages.home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="StaffQueue"
        component={StaffQueue}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Queue" icon={AppImages.queue} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PageProvider"
        component={PageProvider}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Page Provider"
              icon={AppImages.pageProvider}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="StaffMessages"
        component={StaffMessages}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Messages"
              icon={AppImages.messages}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="StaffProfile"
        component={StaffProfile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Profile"
              icon={AppImages.profile}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StaffStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffBottomTabs" component={StaffBottomTabs} />
      <Stack.Screen name="StaffChat" component={StaffChat} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="StaffEditProfile" component={StaffEditProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height:
      Platform.OS === 'ios' ? responsiveHeight(10.5) : responsiveHeight(9.5), // Responsive dynamic height
    backgroundColor: '#0C4F51', // Matching exact deep dark teal from Screenshot 2026-07-02 at 10.14.57 PM.png
    borderTopLeftRadius: 35, // Smooth corner radius
    borderTopRightRadius: 35,
    borderTopWidth: 0,
    position: 'absolute', // Ensures smooth layout over active screens
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingHorizontal: responsiveWidth(2),
    paddingTop: responsiveHeight(2.5),
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(19), // Expanded to give text plenty of horizontal room
    height: '100%',
    paddingTop: responsiveHeight(1),
    // backgroundColor: 'red',
  },
  tabIcon: {
    width: responsiveWidth(6), // Perfectly sized responsive icons
    height: responsiveWidth(6),
    marginBottom: responsiveHeight(0.6),
  },
  tabIconActive: {
    tintColor: '#FFFFFF',
  },
  tabIconInactive: {
    tintColor: 'rgba(255, 255, 255, 0.65)',
  },
  tabLabel: {
    fontSize: responsiveFontSize(1.3), // Calibrated for crisp readability
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default StaffStack;
