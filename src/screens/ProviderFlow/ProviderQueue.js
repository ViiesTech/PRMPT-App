import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { showToast } from '../../utils/ShowToast';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { selectUser } from '../../redux/Slices';
import AppLoader from '../../componets/AppLoader';
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useSetBookingDelayMutation,
} from '../../Services/OtherServices';
import { AppColors } from '../../utils/AppColors';
import {
  getStatusStyles,
  getRemainingDelayTime,
  getElapsedTime,
  getAvatarProps,
} from '../../utils/Utils';

const ProviderQueue = ({ navigation }) => {
  const [delayModalVisible, setDelayModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [page, setPage] = useState(1);
  const [allBookings, setAllBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(0);

  const userData = useSelector(selectUser);
  const currentDate = new Date().toISOString().split('T')[0];

  const {
    data: bookingsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBookingsQuery(
    {
      providerId: userData?._id,
      date: currentDate,
      page,
      limit: 10,
    },
    { skip: !userData?._id },
  );

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [setBookingDelay] = useSetBookingDelayMutation();

  useEffect(() => {
    if (bookingsData?.data) {
      if (page === 1) {
        setAllBookings(bookingsData.data);
      } else {
        setAllBookings(prev => {
          const newItems = bookingsData.data.filter(
            item => !prev.some(existing => existing._id === item._id),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [bookingsData, page]);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      refetch();
    }, [refetch]),
  );

  const queueList = allBookings;

  const hasActiveTimer = queueList.some(
    item =>
      item.status === 'inprogress' ||
      item.status === 'pending' ||
      ((item.status === 'delayed' || item.isDelay) &&
        item.delay &&
        new Date(item.delay).getTime() > Date.now()),
  );

  useEffect(() => {
    if (!hasActiveTimer) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasActiveTimer]);

  const handleOnMyWay = async id => {
    try {
      await updateBookingStatus({
        bookingId: id,
        status: 'inprogress',
      }).unwrap();
      showToast('On My Way', 'Patient is now In Progress', 'success');
      setPage(1);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update status', '', 'error');
    }
  };

  const handleOpenDelayModal = patient => {
    setSelectedPatient(patient);
    setDelayModalVisible(true);
  };

  const handleSelectDelay = async duration => {
    // console.log('Duration:-', duration);
    // console.log('Selected Patient:-', selectedPatient);
    if (selectedPatient) {
      const delayMinutes = parseInt(duration, 10) || 0;
      try {
        await setBookingDelay({
          bookingId: selectedPatient._id,
          delayMinutes,
        }).unwrap();
        showToast(
          'Delay Set',
          `Added ${duration} delay for ${selectedPatient.patientName}`,
          'success',
        );
        setPage(1);
        refetch();
      } catch (err) {
        showToast(err?.data?.message || 'Failed to set delay', '', 'error');
      }
    }
    setDelayModalVisible(false);
    setSelectedPatient(null);
  };

  const handleDismiss = async id => {
    try {
      await updateBookingStatus({
        bookingId: id,
        status: 'completed',
      }).unwrap();
      showToast('Patient Dismissed', 'Patient has been dismissed', 'success');
      setPage(1);
      refetch();
    } catch (err) {
      console.log('error: ', err);
      showToast(err?.data?.message, '', 'error');
    }
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.listEmptyComponent}>
        <Text style={styles.emptyText}>No Bookings for today.</Text>
      </View>
    );
  };

  const renderFooter = useCallback(() => {
    if (isFetching && page > 1) {
      return (
        <View style={styles.listFooterLoader}>
          <ActivityIndicator size="small" color="#0C4F51" />
        </View>
      );
    }
    return null;
  }, [isFetching, page]);

  if (isLoading) {
    return <AppLoader />;
  }

  // console.log('queueList:-', queueList);
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
      <FlatList
        data={queueList}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={listEmptyComponent}
        renderItem={({ item, index }) => {
          const isWaiting =
            item.status === 'pending' || item.status === 'delayed';
          const avatar = getAvatarProps(index);
          const statusStyle = getStatusStyles(item.status);
          const displayRoom = item.roomId?.roomNo
            ? `Room ${item.roomId.roomNo}`
            : 'No Room';
          const serviceName =
            item.subServiceId?.subServiceName || 'Unnamed Service';

          return (
            <View style={styles.queueCard}>
              {/* Card Body - Left Handle & Avatar, Right Patient Info */}
              <View style={styles.cardMainBody}>
                {/* Drag handle & avatar circle */}
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: avatar.bg },
                    ]}
                  >
                    <Feather
                      name={avatar.icon}
                      size={16}
                      color={avatar.color}
                    />
                  </View>
                </View>

                {/* Patient details */}
                <View style={styles.cardMiddle}>
                  <View style={styles.patientInfoRow}>
                    <Text style={styles.patientName} numberOfLines={1}>
                      {item.patientName}
                    </Text>

                    <View
                      style={[
                        styles.statusTag,
                        { backgroundColor: statusStyle.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {statusStyle.text}
                      </Text>
                    </View>
                  </View>

                  {/* Second Row: Service Name & Room Tag */}
                  <View style={styles.serviceRoomRow}>
                    <Text style={styles.serviceName}>{serviceName}</Text>
                    <View style={styles.roomTag}>
                      <Text style={styles.roomTagText}>{displayRoom}</Text>
                    </View>
                  </View>

                  <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>
                      Provider:{' '}
                      <Text style={styles.counterText}>
                        {item.providerId?.fullName}
                      </Text>
                    </Text>

                    {item.status !== 'completed' && (
                      <Text style={styles.metaText}>
                        {item.status === 'inprogress'
                          ? 'In progress'
                          : 'Waiting'}
                        :{' '}
                        <Text style={styles.counterText}>
                          {item.status === 'inprogress'
                            ? getElapsedTime(item.resDuration)
                            : item.status === 'pending'
                            ? getElapsedTime(item.date || item.createdAt)
                            : item.status === 'delayed' || item.isDelay
                            ? getRemainingDelayTime(item.delay)
                            : item.resTime || '0m'}
                        </Text>
                      </Text>
                    )}
                  </View>

                  {item?.note ? (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionText}>{item?.note}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Action Buttons in a horizontal row at the bottom of the card */}
              <View style={styles.buttonsRow}>
                {isWaiting ? (
                  <>
                    <TouchableOpacity
                      style={styles.onMyWayButton}
                      activeOpacity={0.8}
                      onPress={() => handleOnMyWay(item._id)}
                    >
                      <Feather name="arrow-right" size={14} color="#FFFFFF" />
                      <Text style={styles.onMyWayButtonText}>On My Way</Text>
                    </TouchableOpacity>

                    {item.status !== 'delayed' && !item.isDelay ? (
                      <TouchableOpacity
                        style={styles.delayButton}
                        activeOpacity={0.8}
                        onPress={() => handleOpenDelayModal(item)}
                      >
                        <Feather name="clock" size={14} color="#D97706" />
                        <Text style={styles.delayButtonText}>Delay</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}

                {item?.status !== 'completed' ? (
                  <TouchableOpacity
                    style={styles.dismissButton}
                    activeOpacity={0.8}
                    onPress={() => handleDismiss(item._id)}
                  >
                    <Feather name="check" size={14} color="#DC2626" />
                    <Text style={styles.dismissButtonText}>Dismiss</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        }}
        onEndReached={() => {
          if (bookingsData?.pagination?.hasNextPage && !isFetching) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

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
    marginBottom: responsiveHeight(0.2),
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
    marginTop: responsiveHeight(0.5),
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
  statusTagInProgress: {
    backgroundColor: '#D1FAE5',
  },
  statusTagDelayed: {
    backgroundColor: '#FEF3C7',
  },
  statusTagWaiting: {
    backgroundColor: '#E6F4EA',
  },
  statusTextInProgress: {
    color: '#065F46',
  },
  statusTextDelayed: {
    color: '#E6A300',
  },
  statusTextWaiting: {
    color: '#10B981',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 5,
  },
  counterText: {
    color: AppColors.darkGray,
    fontWeight: '600',
  },
  listFooterLoader: {
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
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
  listEmptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    color: '#0C4F51',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProviderQueue;
