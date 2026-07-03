import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { AppImages } from '../../assets/Images/Index';
import AppButton from '../../componets/AppButton';
import Feather from 'react-native-vector-icons/Feather';
import { AppColors } from '../../utils/AppColors';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setRole } from '../../redux/Slices';

const RoleSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState('provider'); // default to provider

  const handleContinue = () => {
    dispatch(setRole(selectedRole));
    navigation.navigate('Login');
  };

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

      {/* Header Row with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={AppImages.logo} style={styles.logo} />
        </View>

        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Please select your profile role to continue
        </Text>

        {/* Roles List */}
        <View style={styles.rolesContainer}>
          {/* Provider Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'provider' && styles.selectedRoleCard,
            ]}
            onPress={() => setSelectedRole('provider')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconWrapper}>
              <Feather
                name="user"
                size={24}
                color={selectedRole === 'provider' ? '#0C4F51' : '#64748B'}
              />
            </View>
            <View style={styles.roleTextWrapper}>
              <Text
                style={[
                  styles.roleTitle,
                  selectedRole === 'provider' && styles.selectedRoleText,
                ]}
              >
                Provider
              </Text>
              <Text style={styles.roleDesc}>
                Log in as doctor, practitioner, or specialist
              </Text>
            </View>
            <View style={styles.radioOutline}>
              {selectedRole === 'provider' && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>

          {/* Staff Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'staff' && styles.selectedRoleCard,
            ]}
            onPress={() => setSelectedRole('staff')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconWrapper}>
              <Feather
                name="users"
                size={24}
                color={selectedRole === 'staff' ? '#0C4F51' : '#64748B'}
              />
            </View>
            <View style={styles.roleTextWrapper}>
              <Text
                style={[
                  styles.roleTitle,
                  selectedRole === 'staff' && styles.selectedRoleText,
                ]}
              >
                Staff
              </Text>
              <Text style={styles.roleDesc}>
                Log in as coordinator, receptionist, or assistant
              </Text>
            </View>
            <View style={styles.radioOutline}>
              {selectedRole === 'staff' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Continue Button */}
      <View style={styles.bottomContainer}>
        <AppButton
          title="Continue"
          gradient={true}
          showArrow={true}
          variant="primary"
          onPress={handleContinue}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(5),
    paddingBottom: responsiveHeight(1),
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
  },
  logoContainer: {
    height: responsiveHeight(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },
  logo: {
    height: responsiveHeight(5.5),
    width: responsiveWidth(36),
    resizeMode: 'contain',
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: responsiveHeight(4),
  },
  rolesContainer: {
    width: '100%',
  },
  roleCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(2.2),
    marginBottom: responsiveHeight(2),
  },
  selectedRoleCard: {
    borderColor: '#0C4F51',
    backgroundColor: '#F0FDFA',
  },
  roleIconWrapper: {
    marginRight: responsiveWidth(4),
  },
  roleTextWrapper: {
    flex: 1,
  },
  roleTitle: {
    fontSize: responsiveFontSize(1.85),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedRoleText: {
    color: '#0C4F51',
  },
  roleDesc: {
    fontSize: responsiveFontSize(1.35),
    color: '#64748B',
    lineHeight: responsiveFontSize(1.9),
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(2),
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0C4F51',
  },
  bottomContainer: {
    paddingBottom: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(6),
  },
});

export default RoleSelectionScreen;
