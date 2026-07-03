import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { AppImages } from '../../assets/Images/Index';
import AppButton from '../../componets/AppButton';

const LoginScreen = ({ navigation, route }) => {
  const role = route?.params?.role || 'provider';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (role === 'staff') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'StaffTabs' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProviderTabs' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stylized Text Header matching Screenshot 2026-07-02 at 9.03.16 PM.png */}
          <View style={styles.headerContainer}>
            {/* <Text style={styles.logoText}>Login</Text> */}
            <Image source={AppImages.login} style={styles.logo} />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Fontisto name="email" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#A3A3A3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Fontisto name="locked" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A3A3A3"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Action Button 1: Login with Linear Gradient */}
          <AppButton
            title={role === 'staff' ? 'Login as Staff' : 'Login as Provider'}
            gradient={true}
            showArrow={true}
            variant="primary"
            onPress={handleLogin}
          />

          {/* Secondary Gradient Button (Verify Account) */}
          <AppButton
            title="Verify your account"
            gradient={true}
            variant="secondary"
            showArrow={true}
            onPress={() => navigation.navigate('VerifyAccount')}
          />
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(8),
    paddingBottom: responsiveHeight(4),
  },
  headerContainer: {
    height: responsiveHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(8),
  },
  logo: {
    height: responsiveHeight(6),
    width: responsiveWidth(36),
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: responsiveHeight(2.5),
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    color: '#666666',
    marginBottom: responsiveHeight(1),
    fontWeight: '500',
    paddingLeft: responsiveWidth(1),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 30,
    paddingHorizontal: responsiveWidth(4),
    height: responsiveHeight(6.8),
    backgroundColor: AppColors.white,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.7),
    color: AppColors.black,
    height: '100%',
    paddingLeft: responsiveWidth(3),
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: responsiveHeight(5),
    paddingRight: responsiveWidth(1),
  },
  forgotText: {
    color: '#0C5355',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
  },
  loginBtn: {
    height: responsiveHeight(6.8),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(6),
  },
  loginBtnText: {
    color: AppColors.white,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingLeft: responsiveWidth(6), // Perfectly balances the arrow on the right
  },
  arrowIcon: {
    color: AppColors.white,
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
  },
});

export default LoginScreen;
