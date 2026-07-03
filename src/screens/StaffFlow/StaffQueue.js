import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { showToast } from '../../utils/ShowToast';

const initialQueueData = [
  {
    id: '1',
    doctor: 'Dr. Sarah Mitchell',
    patient: 'Andrew Ainsley',
    service: 'Local Anesthesia',
    room: 'Room 1',
    wait: '3m 22s',
    status: 'Waiting',
    description: 'Procedure delay due to preparation',
    provider: 'Dr. Sarah Mitchell',
    avatarBg: '#E0E7FF',
    avatarIconColor: '#4F46E5',
    avatarIconName: 'tool',
  },
  {
    id: '2',
    doctor: 'Dr. Sarah Mitchell',
    patient: 'Andrew Ainsley',
    service: 'Post-OP',
    room: 'Room 2',
    wait: '3m 22s',
    status: 'Waiting',
    description: 'its description',
    provider: 'Dr. Sarah Mitchell',
    avatarBg: '#FFE4E6',
    avatarIconColor: '#E11D48',
    avatarIconName: 'zap',
  },
  {
    id: '3',
    doctor: 'Dr. Sarah Mitchell',
    patient: 'Andrew Ainsley',
    service: 'Post-OP',
    room: 'Room 3',
    wait: '3m 22s',
    status: 'Waiting',
    description: 'its description',
    provider: 'Dr. Sarah Mitchell',
    avatarBg: '#FEF3C7',
    avatarIconColor: '#D97706',
    avatarIconName: 'more-horizontal',
  },
];

const StaffQueue = ({ navigation }) => {
  const [queueList, setQueueList] = useState(initialQueueData);

  const handleDischarge = id => {
    const patient = queueList.find(item => item.id === id);
    setQueueList(prev => prev.filter(item => item.id !== id));
    if (patient) {
      showToast(
        'success',
        'Patient Discharged',
        `${patient.patient} has been discharged`,
      );
    }
  };

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Patient Queue</Text>
          <Text style={styles.headerSubtitle}>
            {queueList.length} {queueList.length === 1 ? 'patient' : 'patients'}{' '}
            assigned
          </Text>
        </View>
      </View>

      {/* Queue Cards List Container */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {queueList.map(item => {
          return (
            <View key={item.id} style={styles.queueCard}>
              {/* Card Body - Left Handle & Avatar, Right Patient Info */}
              <View style={styles.cardMainBody}>
                {/* Drag handle & avatar circle */}
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: item.avatarBg },
                    ]}
                  >
                    <Feather
                      name={item.avatarIconName}
                      size={16}
                      color={item.avatarIconColor}
                    />
                  </View>
                </View>

                {/* Patient details */}
                <View style={styles.cardMiddle}>
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientName} numberOfLines={1}>
                      {item.patient}
                    </Text>
                    <View
                      style={[
                        styles.statusTag,
                        item.status === 'In Progress'
                          ? styles.statusTagInProgress
                          : styles.statusTagWaiting,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          item.status === 'In Progress'
                            ? styles.statusTextInProgress
                            : styles.statusTextWaiting,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Second Row: Service Name & Room Tag */}
                  <View style={styles.serviceRoomRow}>
                    <Text style={styles.serviceName}>{item.service}</Text>
                    <View style={styles.roomTag}>
                      <Text style={styles.roomTagText}>{item.room}</Text>
                    </View>
                  </View>

                  {item.description ? (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionText}>
                        {item.description}
                      </Text>
                    </View>
                  ) : null}

                  <Text style={styles.metaText}>
                    {item.status === 'In Progress' ? 'In progress' : 'Waiting'}:{' '}
                    {item.wait} · Provider: {item.provider}
                  </Text>
                </View>
              </View>

              {/* Action Buttons in a horizontal row at the bottom of the card */}
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.dischargeButton}
                  activeOpacity={0.8}
                  onPress={() => handleDischarge(item.id)}
                >
                  <Feather name="check" size={14} color="#EF4444" />
                  <Text style={styles.dischargeButtonText}>Discharge</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
    marginRight: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: '#0C4F51',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#64748B',
    marginTop: responsiveHeight(0.3),
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(14),
  },
  queueCard: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveWidth(3.5),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: '#EBF1F1',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardMainBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMiddle: {
    flex: 1,
    paddingHorizontal: responsiveWidth(3),
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: responsiveHeight(0.4),
    position: 'relative',
    paddingRight: responsiveWidth(20),
  },
  patientName: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#1A202C',
    marginRight: responsiveWidth(2),
  },
  statusTag: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.3),
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
  },
  roomTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.3),
    borderRadius: 8,
  },
  roomTagText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
    color: '#0284C7',
  },
  serviceRoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(0.8),
  },
  serviceName: {
    fontSize: responsiveFontSize(1.5),
    color: '#64748B',
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.8),
    marginBottom: responsiveHeight(0.8),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.4),
    color: '#64748B',
  },
  metaText: {
    fontSize: responsiveFontSize(1.3),
    color: '#94A3B8',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5),
    gap: responsiveWidth(2),
  },
  dischargeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FFE4E6',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: responsiveHeight(1),
  },
  dischargeButtonText: {
    color: '#EF4444',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },
  statusTagInProgress: {
    backgroundColor: '#D1FAE5',
  },
  statusTagWaiting: {
    backgroundColor: '#E6F4EA',
  },
  statusTextInProgress: {
    color: '#065F46',
  },
  statusTextWaiting: {
    color: '#10B981',
  },
});

export default StaffQueue;
