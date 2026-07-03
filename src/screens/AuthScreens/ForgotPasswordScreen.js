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
import Ionicons from 'react-native-vector-icons/Ionicons'; // Required for the Back Arrow
import AppButton from '../../componets/AppButton'; // Ensure correct path spelling
import { AppImages } from '../../assets/Images/Index';
import { useForgotPasswordMutation } from '../../Services/Auth';
import { showToast } from '../../utils/ShowToast';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSendCode = async () => {
    navigation.navigate('EmailVerification');
    // if (!email) {
    //   showToast('Error', 'Please enter your email');
    //   return;
    // }
    // let payload = {
    //   type: 'forget',
    //   email: email,
    // };
    // setLoading(true);
    // let res = await forgotPassword(payload);
    // setLoading(false);
    // console.log('res in forgotPassword:-', res);
    // if (res?.data?.status) {
    //   showToast('Success', res?.data?.message);
    //   navigation.navigate('EmailVerification', {
    //     email: email,
    //     type: 'forget',
    //   });
    // } else {
    //   console.log('err in forgotPassword:-', res?.error?.data?.message);
    //   showToast('Error', res?.error?.data?.message, 'error');
    // }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.white} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
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
            <Image source={AppImages.forgetPassword} style={styles.logo} />
          </View>

          {/* Description Instruction */}
          <Text style={styles.descriptionText}>
            Please type your email below and we will give you a OTP code
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
    marginBottom: responsiveHeight(4),
  },
  logo: {
    height: responsiveHeight(10),
    width: responsiveWidth(40),
    resizeMode: 'contain',
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.8),
    color: '#666666',
    textAlign: 'center',
    lineHeight: responsiveFontSize(2.6),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(6),
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

export default ForgotPasswordScreen;
