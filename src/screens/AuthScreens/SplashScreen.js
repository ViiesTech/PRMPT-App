import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { AppImages } from '../../assets/Images/Index';

const SplashScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[AppColors.g1, AppColors.g2]}
      style={styles.container}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.logoContainer}>
        <Image source={AppImages.logo} style={styles.logo} />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={() => navigation.navigate('RoleSelection')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: responsiveHeight(30),
    width: responsiveWidth(60),
    resizeMode: 'contain',
  },
  bottomContainer: {
    paddingBottom: responsiveHeight(6),
    width: '100%',
    paddingHorizontal: responsiveWidth(20),
  },
  getStartedBtn: {
    backgroundColor: AppColors.white,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: 10,
    alignItems: 'center',
  },
  getStartedText: {
    color: AppColors.secondary,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
});

export default SplashScreen;
