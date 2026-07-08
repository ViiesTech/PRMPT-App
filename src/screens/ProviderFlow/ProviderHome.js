import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';
import { AppColors } from '../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { AppImages } from '../../assets/Images/Index';
import { selectUser } from '../../redux/Slices';
import { useSelector } from 'react-redux';
import { useProviderDashboardQuery } from '../../Services/OtherServices';
import { useFocusEffect } from '@react-navigation/native';
import AppLoader from '../../componets/AppLoader';

const ProviderHome = ({ navigation }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const userData = useSelector(selectUser);
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useProviderDashboardQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const responseData = dashboardData?.data;
  const bookingsCounts = responseData?.bookings?.counts;
  const roomsList = responseData?.rooms || [];
  const currentSelectedRoom = roomsList.find(r => r.roomNo === selectedRoomId);

  if (isLoading && !responseData) {
    return <AppLoader />;
  }

  // console.log('responseData:-', responseData);
  // console.log(
  //   'currentSelectedRoom:-',
  //   currentSelectedRoom?.bookingId?.providerId?.fullName,
  // );
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F7FA" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Profile Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good Morning 👋</Text>
            <Text style={styles.profileName}>
              {userData?.fullName} {userData?.lastName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellNotificationBtn}
            activeOpacity={0.8}
          >
            <Feather name="bell" size={22} color="#134E50" />
            <View style={styles.redBadgeDot} />
          </TouchableOpacity>
        </View>

        {/* Dashboard Promo Card Banner */}
        <ImageBackground
          source={AppImages.banner}
          resizeMode="cover"
          style={styles.dashboardBanner}
          imageStyle={{ borderRadius: 20 }}
        >
          <Text style={styles.bannerTitle}>Provider{'\n'}Dashboard</Text>
          <Text style={styles.bannerSubtitle}>
            Real-time overview of all operations
          </Text>
        </ImageBackground>

        {/* Triple Summary Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.iconContainer}>
              <Feather name="clock" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContainer}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                Waiting
              </Text>
              <Text style={styles.metricCounter}>
                {bookingsCounts?.pending || 0}
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContainer}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                In Progress
              </Text>
              <Text style={styles.metricCounter}>
                {bookingsCounts?.inprogress || 0}
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.iconContainer}>
              <Feather name="alert-circle" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContainer}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                Delayed
              </Text>
              <Text style={styles.metricCounter}>
                {bookingsCounts?.delayed || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 1: Room Status Grid */}
        <View style={styles.whiteSectionBlock}>
          <Text style={styles.blockHeadingTitle}>Room Status Grid</Text>

          <View style={styles.gridRoomsContainer}>
            {roomsList.map((room, index) => {
              const isLastInRow = (index + 1) % 3 === 0;
              const dynamicMarginRight = isLastInRow ? 0 : '2%';
              const isCurrentlySelected = room.roomNo === selectedRoomId;
              const isActive = !!room.bookingId;
              const booking = room.bookingId;

              return (
                <TouchableOpacity
                  key={room._id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedRoomId(room.roomNo)}
                  style={[
                    styles.roomBox,
                    isCurrentlySelected
                      ? styles.roomBoxSelected
                      : styles.roomBoxUnselected,
                    { marginRight: dynamicMarginRight },
                  ]}
                >
                  <View style={styles.roomHeaderRow}>
                    <Feather
                      name="home"
                      size={11}
                      color={isCurrentlySelected ? AppColors.white : '#666666'}
                    />
                    <Text
                      style={
                        isCurrentlySelected
                          ? styles.roomNoTextSelected
                          : styles.roomNoTextUnselected
                      }
                    >
                      Room {room.roomNo}
                    </Text>
                  </View>

                  {isActive ? (
                    <View>
                      <Text
                        style={[
                          styles.activePatientName,
                          {
                            color: isCurrentlySelected
                              ? AppColors.white
                              : AppColors.black,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {booking.patientName}
                      </Text>

                      <Text
                        style={[
                          styles.activePatientType,
                          {
                            color: isCurrentlySelected ? '#A9D6D7' : '#718096',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {booking.subServiceId?.subServiceName}
                      </Text>

                      <Text
                        style={[
                          styles.activeStatusTag,
                          {
                            color: isCurrentlySelected
                              ? AppColors.white
                              : '#A0AEC0',
                          },
                        ]}
                      >
                        {booking.status === 'inprogress'
                          ? 'In Progress'
                          : booking.status}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.noAssignmentText,
                        isCurrentlySelected && { color: '#A9D6D7' },
                      ]}
                    >
                      No assignment
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Patient Queue / Conditional Detail View */}
        <View style={styles.whiteSectionBlock}>
          <Text style={styles.blockHeadingTitle}>Patient Queue</Text>
          {currentSelectedRoom.bookingId && (
            <Text style={styles.doctorSubheading}>
              Dr. {currentSelectedRoom?.bookingId?.providerId?.fullName} (Room{' '}
              {selectedRoomId})
            </Text>
          )}

          {currentSelectedRoom && currentSelectedRoom.bookingId ? (
            <View>
              {/* Table Headers */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeadCell, styles.colPatient]}>
                  PATIENT
                </Text>
                <Text style={[styles.tableHeadCell, styles.colService]}>
                  SERVICE
                </Text>

                <Text style={[styles.tableHeadCell, styles.colWait]}>WAIT</Text>
                <Text style={[styles.tableHeadCell, styles.colStatusText]}>
                  STATUS
                </Text>
              </View>

              {/* Table Row Content */}
              <View style={styles.tableDataRow}>
                <Text
                  style={[styles.tableBodyText, styles.colPatientBold]}
                  numberOfLines={1}
                >
                  {currentSelectedRoom.bookingId.patientName}
                </Text>
                <Text
                  style={[styles.tableBodyText, styles.colService]}
                  numberOfLines={1}
                >
                  {currentSelectedRoom.bookingId.subServiceId?.subServiceName}
                </Text>

                <Text
                  style={[styles.tableBodyText, styles.colWait]}
                  numberOfLines={1}
                >
                  {currentSelectedRoom.bookingId.resTime || '0m'}
                </Text>
                <View style={styles.colStatus}>
                  <View style={styles.waitingStatusPill}>
                    <Text style={styles.waitingPillText}>
                      {currentSelectedRoom.bookingId.status === 'inprogress'
                        ? 'In Progress'
                        : currentSelectedRoom.bookingId.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.notAssignedContainer}>
              <Feather name="user-x" size={24} color="#A0AEC0" />
              <Text style={styles.notAssignedTextHeading}>Not Assigned</Text>
              <Text style={styles.notAssignedSubText}>
                No active diagnostic schedule inside Room {selectedRoomId}
              </Text>
            </View>
          )}
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
  scrollContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
    paddingBottom: responsiveHeight(14),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2.5),
  },
  greetingText: {
    fontSize: responsiveFontSize(1.6),
    color: '#666666',
  },
  profileName: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: AppColors.black,
    marginTop: 2,
  },
  bellNotificationBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  redBadgeDot: {
    position: 'absolute',
    top: 13,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF5A5A',
  },
  dashboardBanner: {
    width: responsiveWidth(92),
    backgroundColor: '#0C4F51',
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(5.5),
    paddingVertical: responsiveHeight(3.5),
    marginBottom: responsiveHeight(2.5),
  },
  bannerTitle: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
    color: AppColors.white,
    lineHeight: responsiveHeight(4.2),
  },
  bannerSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#A9D6D7',
    marginTop: responsiveHeight(1.5),
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: responsiveHeight(3),
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C4F51',
    borderRadius: 12,
    width: '31.5%',
    height: responsiveHeight(7.5),
    paddingHorizontal: responsiveWidth(2.5),
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    marginRight: responsiveWidth(1),
  },
  metricTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: responsiveFontSize(1.3),
    color: '#A9D6D7',
  },
  metricCounter: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: AppColors.white,
    marginTop: -2,
  },
  whiteSectionBlock: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: responsiveWidth(4.5),
    marginBottom: responsiveHeight(2.5),
    borderWidth: 1,
    borderColor: '#EBF1F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  blockHeadingTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: AppColors.black,
    marginBottom: responsiveHeight(2),
  },
  gridRoomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  roomBox: {
    width: '32%',
    height: responsiveHeight(9.5),
    borderRadius: 10,
    padding: responsiveWidth(1.8),
    marginBottom: responsiveHeight(1.2),
    justifyContent: 'space-between',
  },
  roomBoxSelected: {
    backgroundColor: '#0C4F51',
    borderWidth: 1,
    borderColor: '#0C4F51',
  },
  roomBoxUnselected: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: '#E6ECEC',
  },
  roomHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  roomNoTextSelected: {
    fontWeight: '600',
    fontSize: responsiveFontSize(1.2),
    color: AppColors.white,
    marginLeft: 3,
  },
  roomNoTextUnselected: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
    color: AppColors.black,
    marginLeft: 3,
  },
  activePatientName: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
    // marginTop: 2,
  },
  activePatientType: {
    fontSize: responsiveFontSize(1.0),
  },
  activeStatusTag: {
    fontSize: responsiveFontSize(0.9),
    textAlign: 'right',
    opacity: 0.9,
    textTransform: 'capitalize',
    paddingTop: responsiveHeight(1),
    // backgroundColor: 'red',
  },
  noAssignmentText: {
    fontSize: responsiveFontSize(1.2),
    color: '#A0AEC0',
    lineHeight: responsiveHeight(1.4),
    marginTop: responsiveHeight(0.3),
    textAlign: 'center',
  },
  doctorSubheading: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#0C4F51',
    marginBottom: responsiveHeight(2.5),
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EDF2F7',
    paddingBottom: responsiveHeight(1.2),
    marginBottom: responsiveHeight(1.5),
  },
  tableHeadCell: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '700',
    color: '#4A5568',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.8),
  },
  tableBodyText: {
    fontSize: responsiveFontSize(1.4),
    color: '#2D3748',
  },
  colPatient: {
    flex: 2.2,
    paddingRight: responsiveWidth(2),
  },
  colPatientBold: {
    flex: 2.2,
    fontWeight: '700',
    paddingRight: responsiveWidth(2),
  },
  colService: {
    flex: 3.0,
    paddingRight: responsiveWidth(2),
  },
  colRoom: {
    flex: 0.9,
  },
  colWait: {
    flex: 2.2,
    paddingRight: responsiveWidth(2),
  },
  colStatus: {
    flex: 1.6,
    alignItems: 'flex-end',
  },
  colStatusText: {
    flex: 1.6,
    textAlign: 'right',
  },
  waitingStatusPill: {
    backgroundColor: '#E6FFFA',
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  waitingPillText: {
    fontSize: responsiveFontSize(1),
    fontWeight: '600',
    color: '#319795',
    textTransform: 'capitalize',
  },
  notAssignedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(3),
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  notAssignedTextHeading: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#4A5568',
    marginTop: responsiveHeight(1),
  },
  notAssignedSubText: {
    fontSize: responsiveFontSize(1.3),
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: responsiveWidth(4),
  },
});

export default ProviderHome;
