import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
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
    patient: 'Tailor',
    service: 'Crown Placement',
    room: 'Room 2',
    wait: '2m 43s',
    status: 'Waiting',
    description: 'its description',
    provider: 'Jhon Doe',
    avatarBg: '#E0E7FF',
    avatarIconColor: '#4F46E5',
    avatarIconName: 'tool',
  },
  {
    id: '2',
    patient: 'Alex',
    service: 'Local Anesthesia',
    room: 'Room 6',
    wait: '3m 12s',
    status: 'Waiting',
    description: 'its Description',
    provider: 'Jhon Doe',
    avatarBg: '#FFE4E6',
    avatarIconColor: '#E11D48',
    avatarIconName: 'zap',
  },
  {
    id: '3',
    patient: 'Haviva Shepherd',
    service: 'Consultation',
    room: 'Room 4',
    wait: '143h 15m',
    status: 'In Progress',
    description: 'Ipsum irure maiores',
    provider: 'Jhon Doe',
    avatarBg: '#FEF3C7',
    avatarIconColor: '#D97706',
    avatarIconName: 'more-horizontal',
  },
];

const ProviderQueue = ({ navigation }) => {
  const [queueList, setQueueList] = useState(initialQueueData);
  const [delayModalVisible, setDelayModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOnMyWay = id => {
    setQueueList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'In Progress' } : item,
      ),
    );
    const patient = queueList.find(item => item.id === id);
    if (patient) {
      showToast(
        'success',
        'On My Way',
        `${patient.patient} is now In Progress`,
      );
    }
  };

  const handleOpenDelayModal = patient => {
    setSelectedPatient(patient);
    setDelayModalVisible(true);
  };

  const handleSelectDelay = duration => {
    if (selectedPatient) {
      showToast(
        'success',
        'Delay Set',
        `Added ${duration} delay for ${selectedPatient.patient}`,
      );
    }
    setDelayModalVisible(false);
    setSelectedPatient(null);
  };

  const handleDismiss = id => {
    const patient = queueList.find(item => item.id === id);
    setQueueList(prev => prev.filter(item => item.id !== id));
    if (patient) {
      showToast(
        'success',
        'Patient Dismissed',
        `${patient.patient} has been dismissed`,
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
          <Text style={styles.headerTitle}>My Queue</Text>
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
          const isWaiting = item.status === 'Waiting';
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
                {isWaiting ? (
                  <>
                    <TouchableOpacity
                      style={styles.onMyWayButton}
                      activeOpacity={0.8}
                      onPress={() => handleOnMyWay(item.id)}
                    >
                      <Feather name="arrow-right" size={14} color="#FFFFFF" />
                      <Text style={styles.onMyWayButtonText}>On My Way</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.delayButton}
                      activeOpacity={0.8}
                      onPress={() => handleOpenDelayModal(item)}
                    >
                      <Feather name="clock" size={14} color="#D97706" />
                      <Text style={styles.delayButtonText}>Delay</Text>
                    </TouchableOpacity>
                  </>
                ) : null}

                <TouchableOpacity
                  style={styles.dismissButton}
                  activeOpacity={0.8}
                  onPress={() => handleDismiss(item.id)}
                >
                  <Feather name="check" size={14} color="#DC2626" />
                  <Text style={styles.dismissButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Delay Modal Dialog */}
      <Modal
        visible={delayModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDelayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set a Delay</Text>
            <Text style={styles.modalSubtitle}>
              How long will you be delayed?
            </Text>

            <View style={styles.modalGrid}>
              {['5 min', '10 min', '15 min', '20 min', '30 min'].map(
                duration => (
                  <TouchableOpacity
                    key={duration}
                    style={styles.modalOption}
                    activeOpacity={0.7}
                    onPress={() => handleSelectDelay(duration)}
                  >
                    <Text style={styles.modalOptionText}>{duration}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={() => setDelayModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dragIcon: {
    marginRight: responsiveWidth(2),
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
  onMyWayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingVertical: responsiveHeight(1),
  },
  onMyWayButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },
  delayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: responsiveHeight(1),
  },
  delayButtonText: {
    color: '#D97706',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },
  dismissButton: {
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
  dismissButtonText: {
    color: '#EF4444',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(6),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: responsiveWidth(6),
    width: '100%',
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: responsiveHeight(0.5),
  },
  modalSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#64748B',
    marginBottom: responsiveHeight(2.5),
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -responsiveWidth(1),
    marginBottom: responsiveHeight(1.5),
  },
  modalOption: {
    width: '30.5%',
    marginHorizontal: '1.4%',
    marginBottom: responsiveHeight(1.5),
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionText: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#1E293B',
  },
  cancelButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(1),
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    color: '#0C4F51',
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

export default ProviderQueue;
