/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { StyleSheet, View, Platform, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from '../utils/Responsive_Dimensions';
import { AppImages } from '../assets/Images/Index';

// Provider Screens
import ProviderHome from '../screens/ProviderFlow/ProviderHome';
import ProviderQueue from '../screens/ProviderFlow/ProviderQueue';
import KPIReports from '../screens/ProviderFlow/KPIReports';
import ProviderMessages from '../screens/ProviderFlow/ProviderMessages';
import ProviderProfile from '../screens/ProviderFlow/ProviderProfile';
import ProviderChat from '../screens/ProviderFlow/ProviderChat';
import ChangePassword from '../screens/AuthScreens/ChangePassword';

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
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {label}
    </Text>
  </View>
);

const ProviderBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={ProviderHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" icon={AppImages.home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProviderQueue"
        component={ProviderQueue}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="My Queue"
              icon={AppImages.queue}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="KPIReports"
        component={KPIReports}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="KPI Reports"
              icon={AppImages.queue}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProviderMessages"
        component={ProviderMessages}
        initialParams={{ chatScreen: 'ProviderChatScreen' }}
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
        name="ProviderProfile"
        component={ProviderProfile}
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

const ProviderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProviderBottomTabs" component={ProviderBottomTabs} />
      <Stack.Screen name="ProviderChat" component={ProviderChat} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height:
      Platform.OS === 'ios' ? responsiveHeight(10.5) : responsiveHeight(9.5),
    backgroundColor: '#0C4F51',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderTopWidth: 0,
    position: 'absolute',
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
    width: responsiveWidth(19),
    height: '100%',
    paddingTop: responsiveHeight(1),
  },
  tabIcon: {
    width: responsiveWidth(6),
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
    fontSize: responsiveFontSize(1.3),
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

export default ProviderStack;
