import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setClearStore } from '../../redux/Slices';
import api from '../../Constants/Api.constants';

const ProviderProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const hadleLogout = () => {
    dispatch(setClearStore());

    // Reset navigation to Auth stack
    const rootNav = navigation.getParent()?.getParent();
    if (rootNav) {
      rootNav.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Splash' } }],
      });
    } else {
      navigation.navigate('Auth', { screen: 'Splash' });
    }
  };

  // console.log('user:-', user);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F7FA" barStyle="dark-content" />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#0C4F51" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Details Block */}
        <View style={styles.profileHeaderContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: user?.profile
                  ? `${api.imageUrl}${user?.profile}`
                  : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&h=250&fit=crop',
              }}
              style={styles.avatarImage}
            />
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProviderEditProfile')}
            >
              <Feather name="edit-2" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {user?.fullName} {user?.lastName}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Horizontal Divider Line */}
        <View style={styles.divider} />

        {/* Profile Options List */}
        <View style={styles.menuContainer}>
          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProviderEditProfile')}
          >
            <View style={styles.menuRowLeft}>
              <Feather
                name="user"
                size={22}
                color="#1F2937"
                style={styles.menuRowIcon}
              />
              <Text style={styles.menuRowLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.menuRowLeft}>
              <Feather
                name="shield"
                size={22}
                color="#1F2937"
                style={styles.menuRowIcon}
              />
              <Text style={styles.menuRowLabel}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={hadleLogout}
          >
            <View style={styles.menuRowLeft}>
              <Feather
                name="log-out"
                size={22}
                color="#EF4444"
                style={styles.menuRowIcon}
              />
              <Text style={[styles.menuRowLabel, styles.logoutText]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginRight: responsiveWidth(4),
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
    paddingBottom: responsiveHeight(14), // Room for bottom absolute tab bar
  },
  profileHeaderContainer: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(3),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: responsiveHeight(2.5),
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ccc',
    resizeMode: 'cover',
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
  profileName: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '700',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: responsiveHeight(0.8),
  },
  divider: {
    height: 1.2,
    backgroundColor: '#ECEFF1',
    marginHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(3),
  },
  menuContainer: {
    paddingHorizontal: responsiveWidth(5),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(2),
    marginBottom: responsiveHeight(1.5),
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRowIcon: {
    marginRight: responsiveWidth(5),
  },
  menuRowLabel: {
    fontSize: responsiveFontSize(1.85),
    fontWeight: '600',
    color: '#1F2937',
  },
  logoutText: {
    color: '#EF4444',
  },
});

export default ProviderProfile;
