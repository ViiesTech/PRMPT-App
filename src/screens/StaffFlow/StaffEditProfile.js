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
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import AppButton from '../../componets/AppButton';
import { showToast } from '../../utils/ShowToast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../../redux/Slices';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUpdateProfileMutation } from '../../Services/OtherServices';
import api from '../../Constants/Api.constants';

const StaffEditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      response => {
        if (
          !response.didCancel &&
          !response.errorCode &&
          response.assets?.[0]?.uri
        ) {
          setSelectedImage(response.assets[0].uri);
        }
      },
    );
  };
  console.log('User:-', user);

  const handleSave = async () => {
    if (!fullName.trim()) {
      showToast('Validation Error', 'Full Name is required', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());

      if (selectedImage) {
        const uriParts = selectedImage.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop();

        formData.append('profile', {
          uri: selectedImage,
          name: fileName || 'profile.jpg',
          type: `image/${fileType === 'jpg' ? 'jpeg' : fileType || 'jpeg'}`,
        });
      }

      const response = await updateProfile(formData).unwrap();

      if (response?.success) {
        dispatch(setUser(response.data));
        showToast(
          'Success',
          response.message || 'Profile updated successfully!',
          'success',
        );
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to update profile',
          'error',
        );
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      showToast(
        'Error',
        error?.data?.message || 'An error occurred while updating profile',
        'error',
      );
    }
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Edit Block */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: selectedImage
                    ? selectedImage
                    : user?.profile
                    ? `${api.imageUrl}${user?.profile}`
                    : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&h=250&fit=crop',
                }}
                style={styles.avatarImage}
              />
              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={0.8}
                onPress={handlePickImage}
              >
                <Feather name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={18} color="#A3A3A3" />
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                placeholderTextColor="#A3A3A3"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Designation Field (ReadOnly) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Designation</Text>
            <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
              <Feather name="briefcase" size={18} color="#A3A3A3" />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.designation || ''}
                editable={false}
              />
            </View>
          </View>

          {/* Email Field (ReadOnly) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
              <Feather name="mail" size={18} color="#A3A3A3" />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.email || ''}
                editable={false}
              />
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.btnWrapper}>
            <AppButton
              title="Save Changes"
              gradient={true}
              variant="primary"
              onPress={handleSave}
              loading={isLoading}
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
  keyboardAvoidingContainer: {
    flex: 1,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0C4F51',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
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
    backgroundColor: '#F5F7FA',
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
  btnWrapper: {
    marginTop: responsiveHeight(4),
  },
  disabledInputWrapper: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  disabledInput: {
    color: '#6B7280',
  },
});

export default StaffEditProfile;
