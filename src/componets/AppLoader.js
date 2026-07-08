import React from 'react';
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import { AppColors } from '../utils/AppColors';

const AppLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <StatusBar backgroundColor={AppColors.blackOpacity} />
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.blackOpacity,
  },
  loaderBox: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
  },
});
