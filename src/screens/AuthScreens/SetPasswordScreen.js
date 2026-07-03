import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppButton from '../../componets/AppButton'; // Keeping your current folder structure path
import { AppImages } from '../../assets/Images/Index';

const SetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Nav Header Area */}
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
          {/* Two-Toned Headings matching Screenshot 2026-07-02 at 9.59.18 PM.png */}
          <View style={styles.titleContainer}>
            <Image source={AppImages.enterYourPassword} style={styles.logo} />
          </View>

          {/* Exact Subtitle copy from Mockup */}
          <Text style={styles.subtitle}>
            Now you can create new password and confirm a below
          </Text>

          {/* New Password Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <Fontisto name="locked" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A3A3A3"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={secureNew}
              />
              <TouchableOpacity
                onPress={() => setSecureNew(!secureNew)}
                style={styles.eyeIconBtn}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={secureNew ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#A3A3A3"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <Fontisto name="locked" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A3A3A3"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirm}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirm(!secureConfirm)}
                style={styles.eyeIconBtn}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#A3A3A3"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Styled Actions Component */}
          <View style={styles.btnWrapper}>
            <AppButton
              title="Confirm New Password"
              gradient={true}
              variant="primary"
              showArrow={true}
              onPress={() => navigation.navigate('Login')}
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
    lineHeight: responsiveFontSize(2.6),
    marginBottom: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(8),
  },
  inputContainer: {
    width: '100%',
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
    borderRadius: 30, // Fully rounded matching Screenshot 2026-07-02 at 9.59.18 PM.png
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
    paddingRight: responsiveWidth(2),
  },
  eyeIconBtn: {
    padding: responsiveWidth(1),
  },
  btnWrapper: {
    width: '100%',
    marginTop: responsiveHeight(8), // Pushes button downwards closer to screenshot alignment
  },
});

export default SetPasswordScreen;
