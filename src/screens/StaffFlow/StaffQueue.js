import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
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
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../Services/OtherServices';
import { useFocusEffect } from '@react-navigation/native';
import AppLoader from '../../componets/AppLoader';
import {
  getStatusStyles,
  getRemainingDelayTime,
  getElapsedTime,
  getAvatarProps,
} from '../../utils/Utils';

const StaffQueue = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [allBookings, setAllBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(0);

  const currentDate = new Date().toISOString().split('T')[0];

  const {
    data: bookingsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBookingsQuery({
    date: currentDate,
    page,
    limit: 10,
  });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  useEffect(() => {
    if (bookingsResponse?.data) {
      if (page === 1) {
        setAllBookings(bookingsResponse.data);
      } else {
        setAllBookings(prev => {
          const newItems = bookingsResponse.data.filter(
            item => !prev.some(existing => existing._id === item._id),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [bookingsResponse, page]);

  const hasActiveTimer = allBookings.some(
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

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      refetch();
    }, [refetch]),
  );

  const handleDischarge = async bookingId => {
    try {
      const response = await updateBookingStatus({
        bookingId,
        status: 'completed',
      }).unwrap();

      if (response?.success) {
        showToast(
          'Patient Discharged',
          'Patient has been successfully discharged.',
          'success',
        );
        setAllBookings(prev => prev.filter(item => item._id !== bookingId));
      } else {
        showToast(
          'API Error',
          response?.message || 'Failed to discharge patient.',
          'error',
        );
      }
    } catch (error) {
      console.error('Discharge Error:', error);
      showToast(
        'API Error',
        error?.data?.message || 'An error occurred while discharging patient.',
        'error',
      );
    }
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.listEmptyComponent}>
        <Text style={styles.emptyText}>No bookings for today.</Text>
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

  if (isLoading && page === 1) {
    return <AppLoader />;
  }

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
            {allBookings.length}{' '}
            {allBookings.length === 1 ? 'patient' : 'patients'} assigned
          </Text>
        </View>
      </View>

      {/* Queue Cards List Container */}
      <FlatList
        data={allBookings}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={listEmptyComponent}
        onEndReached={() => {
          if (bookingsResponse?.pagination?.hasNextPage && !isFetching) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        renderItem={({ item, index }) => {
          const avatar = getAvatarProps(index);
          const statusStyle = getStatusStyles(item.status);
          const displayRoom = item.roomId?.roomNo
            ? `Room ${item.roomId.roomNo}`
            : 'No Room';
          const serviceName =
            item.subServiceId?.subServiceName || 'Unnamed Service';
          const waitTime =
            item.status === 'inprogress'
              ? getElapsedTime(item.resDuration)
              : item.status === 'pending'
              ? getElapsedTime(item.date || item.createdAt)
              : item.status === 'delayed' || item.isDelay
              ? getRemainingDelayTime(item.delay)
              : item.resTime || '0m';

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

                  {item.note ? (
                    <View style={styles.descriptionBox}>
                      <Text style={styles.descriptionText}>{item.note}</Text>
                    </View>
                  ) : null}

                  <View style={styles.rowContainer}>
                    <Text style={styles.metaText}>
                      Provider:{' '}
                      <Text style={styles.valueText}>
                        {item.providerId?.fullName || 'No Provider'}
                      </Text>
                    </Text>

                    {item.status !== 'completed' && (
                      <Text style={styles.metaText}>
                        {item.status === 'inprogress'
                          ? 'In progress'
                          : 'Waiting'}
                        : <Text style={styles.valueText}>{waitTime}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Action Buttons in a horizontal row at the bottom of the card */}
              {item.status !== 'completed' ? (
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={styles.dischargeButton}
                    activeOpacity={0.8}
                    onPress={() => handleDischarge(item._id)}
                  >
                    <Feather name="check" size={14} color="#EF4444" />
                    <Text style={styles.dischargeButtonText}>Discharge</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
      />
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
  listEmptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  emptyText: {
    fontSize: responsiveFontSize(1.6),
    color: '#64748B',
    fontWeight: '500',
  },
  listFooterLoader: {
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  valueText: {
    color: '#1A202C',
    fontWeight: '600',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
  },
});

export default StaffQueue;
