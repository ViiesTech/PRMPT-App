import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions'; // Path apne hisab se adjust karlein
import { AppColors } from '../utils/AppColors';
import Feather from 'react-native-vector-icons/Feather';

const AppButton = ({
  title,
  onPress,
  gradient = false, // Boolean prop to switch between custom gradients
  variant = 'primary', // 'primary' ya 'secondary' gradient patterns ke liye
  style,
  textStyle,
  showArrow = false,
  fontSize,
}) => {
  // Color themes based on Screenshot 2026-07-02 at 9.03.16 PM.png
  const primaryColors = [AppColors.g1, AppColors.g2, AppColors.g1]; // Light Teal to Dark Teal
  const secondaryColors = ['#17585A', '#0D3335']; // Dark Slate Slate Teal
  const selectedColors =
    variant === 'primary' ? primaryColors : secondaryColors;

  // Render content logic inside the button
  const renderContent = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Text style={[styles.btnText(fontSize), textStyle]}>{title}</Text>
      {showArrow && (
        <Feather
          name="arrow-right"
          size={26}
          color="#FFFFFF"
          style={styles.arrowIcon}
        />
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.wrapper, style]}
    >
      {gradient ? (
        <LinearGradient
          colors={selectedColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonBody}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        // Fallback Solid Color (Agar gradient prop na pass kiya jaye)
        <View
          style={[
            styles.buttonBody,
            styles.solidFallback,
            variant === 'secondary' && styles.solidSecondary,
          ]}
        >
          {renderContent()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: responsiveHeight(2),
  },
  buttonBody: {
    height: responsiveHeight(6.8),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: responsiveWidth(6),
  },
  solidFallback: {
    backgroundColor: '#0EA5A7', // Solid Primary Teal
  },
  solidSecondary: {
    backgroundColor: '#134E50', // Solid Secondary Dark Teal
  },
  btnText: fontSize => ({
    color: '#FFFFFF',
    fontSize: responsiveFontSize(fontSize || 1.9),
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingLeft: responsiveWidth(6), // Arrow control offset
  }),
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    marginRight: responsiveWidth(4),
  },
});

export default AppButton;
