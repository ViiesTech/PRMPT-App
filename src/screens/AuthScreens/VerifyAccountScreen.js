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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../componets/AppButton';
import { AppImages } from '../../assets/Images/Index';

const VerifyAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    navigation.navigate('EmailVerification');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Custom Header Area with Back Arrow */}
        <View style={styles.navHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backArrowContainer}
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
          <View style={styles.titleContainer}>
            <Image source={AppImages.emailVerification} style={styles.logo} />
          </View>

          {/* <Text style={styles.titleText}>Verify Account</Text> */}
          <Text style={styles.descriptionText}>
            Please type your email below and we will send you an OTP code
          </Text>

          {/* Email Input Field */}
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

          {/* Action Send Code Button */}
          <View style={styles.btnSpacing}>
            <AppButton
              title="Send Code"
              gradient={true}
              variant="primary"
              showArrow={true}
              onPress={handleSendCode}
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
  keyboardView: {
    flex: 1,
  },
  navHeader: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
    height: responsiveHeight(10),
    justifyContent: 'center',
  },
  backArrowContainer: {
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
    marginBottom: responsiveHeight(3),
  },
  logo: {
    height: responsiveHeight(10),
    width: responsiveWidth(40),
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: '#0C4F51',
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.7),
    color: '#666666',
    textAlign: 'center',
    lineHeight: responsiveFontSize(2.4),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(5),
  },
  inputContainer: {
    width: '100%',
    marginBottom: responsiveHeight(4),
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
    borderColor: '#E2E2E2',
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
  btnSpacing: {
    width: '100%',
    marginTop: responsiveHeight(1),
  },
});

export default VerifyAccountScreen;
