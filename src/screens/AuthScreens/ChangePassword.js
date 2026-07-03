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
} from 'react-native';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import AppButton from '../../componets/AppButton';
import { showToast } from '../../utils/ShowToast';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handleChangePassword = () => {
    if (!currentPassword.trim()) {
      showToast(
        'Validation Error',
        'Please enter your current password',
        'info',
      );
      return;
    }

    if (newPassword.length < 6) {
      showToast(
        'Validation Error',
        'New password must be at least 6 characters',
        'error',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Validation Error', 'New passwords do not match', 'error');
      return;
    }

    showToast('Validation Error', 'Password changed successfully!', 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F7FA" barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={26} color="#0C4F51" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Please enter your current password and create a new secure password.
          </Text>

          {/* Current Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A3A3A3"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={secureCurrent}
              />
              <TouchableOpacity
                onPress={() => setSecureCurrent(!secureCurrent)}
                style={styles.eyeIconBtn}
                activeOpacity={0.6}
              >
                <Feather
                  name={secureCurrent ? 'eye-off' : 'eye'}
                  size={20}
                  color="#A3A3A3"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#A3A3A3" />
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
                <Feather
                  name={secureNew ? 'eye-off' : 'eye'}
                  size={20}
                  color="#A3A3A3"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#A3A3A3" />
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
                <Feather
                  name={secureConfirm ? 'eye-off' : 'eye'}
                  size={20}
                  color="#A3A3A3"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.btnWrapper}>
            <AppButton
              title="Change Password"
              gradient={true}
              variant="primary"
              onPress={handleChangePassword}
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
    backgroundColor: '#F5F7FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
    paddingBottom: responsiveHeight(2),
    backgroundColor: '#F5F7FA',
  },
  backButton: {
    marginRight: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: '#0C4F51',
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  subtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#64748B',
    marginBottom: responsiveHeight(3),
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: responsiveHeight(2.5),
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: responsiveHeight(1),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: AppColors.white,
    paddingHorizontal: responsiveWidth(4),
    height: responsiveHeight(6.5),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.6),
    color: '#1F2937',
    paddingHorizontal: responsiveWidth(3),
    height: '100%',
  },
  eyeIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(8),
    height: '100%',
  },
  btnWrapper: {
    marginTop: responsiveHeight(4),
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
});

export default ChangePassword;
