import React, { useState } from 'react';
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

const roomsData = [
  {
    id: '01',
    active: true,
    patient: 'Andrew Ainsley',
    type: 'Post-OP',
    status: 'Requested',
    wait: '3m 22s',
  },
  { id: '02', active: false },
  { id: '03', active: false },
  { id: '04', active: false },
  { id: '05', active: false },
  { id: '06', active: false },
  { id: '07', active: false },
  { id: '08', active: false },
  { id: '09', active: false },
  { id: '10', active: false },
];

const StaffHome = ({ navigation }) => {
  const [selectedRoomId, setSelectedRoomId] = useState('01');

  const currentSelectedRoom = roomsData.find(r => r.id === selectedRoomId);

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
            <Text style={styles.profileName}>Robertson Mott</Text>
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
          <Text style={styles.bannerTitle}>Staff{'\n'}Dashboard</Text>
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
              <Text style={styles.metricCounter}>0</Text>
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
              <Text style={styles.metricCounter}>0</Text>
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
              <Text style={styles.metricCounter}>0</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Room Status Grid */}
        <View style={styles.whiteSectionBlock}>
          <Text style={styles.blockHeadingTitle}>Room Status Grid</Text>

          <View style={styles.gridRoomsContainer}>
            {roomsData.map((room, index) => {
              const isLastInRow = (index + 1) % 4 === 0;
              const dynamicMarginRight = isLastInRow ? 0 : '2%';
              const isCurrentlySelected = room.id === selectedRoomId;

              return (
                <TouchableOpacity
                  key={room.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedRoomId(room.id)}
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
                      color={isCurrentlySelected ? '#FFFFFF' : '#666666'}
                    />
                    <Text
                      style={
                        isCurrentlySelected
                          ? styles.roomNoTextSelected
                          : styles.roomNoTextUnselected
                      }
                    >
                      Room {room.id}
                    </Text>
                  </View>

                  {room.active ? (
                    <View>
                      <Text
                        style={[
                          styles.activePatientName,
                          {
                            color: isCurrentlySelected ? '#FFFFFF' : '#1A202C',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {room.patient}
                      </Text>
                      <Text
                        style={[
                          styles.activePatientType,
                          {
                            color: isCurrentlySelected ? '#A9D6D7' : '#718096',
                          },
                        ]}
                      >
                        {room.type}
                      </Text>
                      <Text
                        style={[
                          styles.activeStatusTag,
                          {
                            color: isCurrentlySelected ? '#FFFFFF' : '#A0AEC0',
                          },
                        ]}
                      >
                        {room.status}
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
          <Text style={styles.doctorSubheading}>
            Dr. Sarah Mitchell (Room {selectedRoomId})
          </Text>

          {currentSelectedRoom && currentSelectedRoom.active ? (
            <View>
              {/* Table Headers */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeadCell, { flex: 2.2 }]}>
                  PATIENT
                </Text>
                <Text style={[styles.tableHeadCell, { flex: 1.5 }]}>
                  SERVICE
                </Text>
                <Text style={[styles.tableHeadCell, { flex: 1.5 }]}>ROOM</Text>
                <Text style={[styles.tableHeadCell, { flex: 1.3 }]}>WAIT</Text>
                <Text
                  style={[
                    styles.tableHeadCell,
                    { flex: 1.5, textAlign: 'right' },
                  ]}
                >
                  STATUS
                </Text>
              </View>

              {/* Table Row Content */}
              <View style={styles.tableDataRow}>
                <Text
                  style={[
                    styles.tableBodyText,
                    { flex: 2.2, fontWeight: '700' },
                  ]}
                >
                  {currentSelectedRoom.patient}
                </Text>
                <Text style={[styles.tableBodyText, { flex: 1.5 }]}>
                  {currentSelectedRoom.type}
                </Text>
                <Text style={[styles.tableBodyText, { flex: 1.5 }]}>
                  Room {currentSelectedRoom.id}
                </Text>
                <Text style={[styles.tableBodyText, { flex: 1.3 }]}>
                  {currentSelectedRoom.wait || '0m'}
                </Text>
                <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                  <View style={styles.waitingStatusPill}>
                    <Text style={styles.waitingPillText}>
                      {currentSelectedRoom.status || 'Waiting'}
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
    color: '#111111',
    marginTop: 2,
  },
  bellNotificationBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    marginTop: -2,
  },
  whiteSectionBlock: {
    backgroundColor: '#FFFFFF',
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
    color: '#111111',
    marginBottom: responsiveHeight(2),
  },
  gridRoomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  roomBox: {
    width: '23.5%',
    height: responsiveHeight(8),
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6ECEC',
  },
  roomHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNoTextSelected: {
    fontWeight: '600',
    fontSize: responsiveFontSize(1.1),
    color: '#FFFFFF',
    marginLeft: 3,
  },
  roomNoTextUnselected: {
    fontSize: responsiveFontSize(1.1),
    fontWeight: '600',
    color: '#1A202C',
    marginLeft: 3,
  },
  activePatientName: {
    fontSize: responsiveFontSize(1),
    fontWeight: '600',
    marginTop: 2,
  },
  activePatientType: {
    fontSize: responsiveFontSize(0.9),
  },
  activeStatusTag: {
    fontSize: responsiveFontSize(0.8),
    textAlign: 'right',
    opacity: 0.9,
  },
  noAssignmentText: {
    fontSize: responsiveFontSize(1),
    color: '#A0AEC0',
    lineHeight: responsiveHeight(1.4),
    marginTop: responsiveHeight(0.8),
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
  waitingStatusPill: {
    backgroundColor: '#E6FFFA',
    paddingHorizontal: responsiveWidth(1.5),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  waitingPillText: {
    fontSize: responsiveFontSize(1),
    fontWeight: '600',
    color: '#319795',
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

export default StaffHome;
