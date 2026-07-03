import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../componets/AppButton'; // Keeping your current path typo
import { AppImages } from '../../assets/Images/Index';

const CELL_COUNT = 4;
const INITIAL_TIME = 159; // 2 minutes and 39 seconds in total seconds

const EmailVerificationScreen = ({ navigation }) => {
  const [value, setValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME); // Timer State

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [timeLeft]);

  // Helper function to format seconds into MM:SS
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleResendCode = () => {
    // Apni Resend OTP API Call yahan add karein
    setTimeLeft(INITIAL_TIME); // Timer reset code
    setValue(''); // Optional: Clear old input
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Nav Header Row */}
        <View style={styles.navHeader}>
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#0A5A5C" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Logo Container */}
          <View style={styles.titleContainer}>
            <Image source={AppImages.emailVerification} style={styles.logo} />
          </View>

          {/* Corrected Text Description */}
          <Text style={styles.subtitle}>
            Please type OTP code that we give you
          </Text>

          {/* OTP Code Input Layer */}
          <View style={styles.codeFieldWrapper}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[
                    styles.cell,
                    symbol ? styles.filledCell : null,
                    isFocused && styles.focusCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Dynamic Timer / Resend Action Row */}
          <View style={styles.timerRow}>
            {timeLeft > 0 ? (
              <Text style={styles.timerText}>
                Resend on{' '}
                <Text style={styles.timerBold}>{formatTime(timeLeft)}</Text>
              </Text>
            ) : (
              <TouchableOpacity activeOpacity={0.7} onPress={handleResendCode}>
                <Text style={styles.resendLinkText}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Unified Action Button */}
          <View style={styles.btnContainer}>
            <AppButton
              title="Verify Email"
              gradient={true}
              variant="primary"
              showArrow={true}
              onPress={() => navigation.navigate('SetPassword')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  navHeader: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
    height: responsiveHeight(10),
    justifyContent: 'center',
  },
  backBtnContainer: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },
  logo: {
    height: responsiveHeight(10),
    width: responsiveWidth(40),
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: responsiveFontSize(1.8),
    color: '#666666',
    textAlign: 'center',
    marginBottom: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(4),
  },
  codeFieldWrapper: {
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
  },
  codeFieldRoot: {
    marginBottom: responsiveHeight(1.5),
    justifyContent: 'space-between',
  },
  cell: {
    width: responsiveWidth(18),
    height: responsiveWidth(16),
    backgroundColor: '#F0F4F4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filledCell: {
    backgroundColor: '#F0F4F4',
  },
  focusCell: {
    backgroundColor: AppColors.white,
    borderColor: '#134E50',
  },
  cellText: {
    fontSize: responsiveFontSize(3),
    color: '#134E50',
    fontWeight: '700',
  },
  timerRow: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: responsiveWidth(3),
    marginBottom: responsiveHeight(6),
  },
  timerText: {
    fontSize: responsiveFontSize(1.6),
    color: '#666666',
  },
  timerBold: {
    fontWeight: '700',
    color: '#333333',
  },
  resendLinkText: {
    fontSize: responsiveFontSize(1.6),
    color: '#0A8789', // Active branding teal color
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  btnContainer: {
    width: '100%',
  },
});

export default EmailVerificationScreen;
