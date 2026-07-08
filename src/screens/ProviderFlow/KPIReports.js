import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { AppColors } from '../../utils/AppColors';
import {
  useKpiReportsQuery,
  useGetAllServicesQuery,
} from '../../Services/OtherServices';
import { useFocusEffect } from '@react-navigation/native';
import AppLoader from '../../componets/AppLoader';

const timeframeMapping = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
};

const KPIReports = ({ navigation }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Day');
  const [selectedService, setSelectedService] = useState({
    _id: 'all',
    serviceName: 'All Services',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data, isLoading, isFetching, error, refetch } = useKpiReportsQuery({
    period: timeframeMapping[selectedTimeframe],
    subServiceId: selectedService._id,
  });

  const {
    data: servicesData,
    error: servicesError,
    isLoading: servicesIsLoading,
  } = useGetAllServicesQuery();

  const dropdownServices = [
    { _id: 'all', serviceName: 'All Services' },
    ...(servicesData?.data || []),
  ];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const responseData = data?.data;
  const summary = responseData?.summary;

  // console.log('KPI Query Params:', {
  //   period: timeframeMapping[selectedTimeframe],
  //   subServiceId: selectedService._id,
  // });
  // console.log('KPI State:', {
  //   isLoading,
  //   isFetching,
  //   error: error ? JSON.stringify(error) : null,
  // });
  // console.log('KPI Data:', data);
  // console.log('Services State:', {
  //   servicesIsLoading,
  //   error: servicesError ? JSON.stringify(servicesError) : null,
  // });
  // console.log('Services Data:', servicesData);

  if (isLoading || isFetching) {
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
        <Text style={styles.headerTitle}>KPI Reports</Text>
      </View>

      {/* Filter Bar Row */}
      <View style={styles.filterBar}>
        {/* Timeframe selector tabs */}
        <View style={styles.timeframeContainer}>
          {['Day', 'Week', 'Month', 'Year'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.timeframeTab,
                selectedTimeframe === tab && styles.timeframeTabActive,
              ]}
              onPress={() => setSelectedTimeframe(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === tab && styles.timeframeTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dropdown Selector */}
        <TouchableOpacity
          style={styles.dropdownSelector}
          activeOpacity={0.8}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {selectedService.serviceName}
          </Text>
          <Feather name="chevron-down" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Custom Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownModalContent}>
            <Text style={styles.dropdownModalTitle}>Select Service</Text>
            <ScrollView
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            >
              {dropdownServices.map(service => {
                const isSelected = selectedService._id === service._id;
                return (
                  <TouchableOpacity
                    key={service._id}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedService(service);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextActive,
                      ]}
                    >
                      {service.serviceName}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color="#0C4F51" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Total Patients */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Feather name="user" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContent}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                Total Patients
              </Text>
              <Text style={styles.metricValue}>
                {summary?.totalPatients || 0}
              </Text>
            </View>
          </View>

          {/* Completed */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Feather name="check" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContent}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                Completed
              </Text>
              <Text style={styles.metricValue}>{summary?.completed || 0}</Text>
            </View>
          </View>

          {/* AVG Response */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Feather name="clock" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContent}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                AVG Response
              </Text>
              <Text style={styles.metricValue}>
                {summary?.avgResponseFormatted || '—'}
              </Text>
            </View>
          </View>

          {/* AVG Completion */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Feather name="user" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.metricTextContent}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                AVG Completion
              </Text>
              <Text style={styles.metricValue}>
                {summary?.avgCompletionFormatted || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctors Performance Cards List */}
        <View style={styles.doctorsListContainer}>
          {responseData?.providers?.map(doc => (
            <View
              key={doc._id}
              style={[styles.doctorCard, styles.doctorCardDefault]}
            >
              {/* Doctor Details Row */}
              <View style={styles.docHeaderRow}>
                {doc.profile ? (
                  <Image
                    source={{ uri: doc.profile }}
                    style={styles.docAvatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.docAvatar,
                      {
                        backgroundColor: '#E2E8F0',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Feather name="user" size={24} color="#A0AEC0" />
                  </View>
                )}
                <View style={styles.docInfoWrapper}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {doc.fullName}
                  </Text>
                  <Text style={styles.docSpecialty}>{doc.designation}</Text>
                </View>
              </View>

              {/* Performance Stats Row */}
              <View style={styles.docStatsRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>{doc.totalPatients || 0}</Text>
                  <Text style={styles.statLabel}>PATIENTS</Text>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>
                    {doc.avgResponseFormatted || '—'}
                  </Text>
                  <Text style={styles.statLabel}>AVG RESPONSE</Text>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>
                    {doc.avgCompletionFormatted || '—'}
                  </Text>
                  <Text style={styles.statLabel}>AVG COMPLETION</Text>
                </View>
              </View>

              <View style={styles.cardHorizontalDivider} />

              {/* Lower Details Table Section */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeadCell, styles.flex2]}>
                  SERVICE
                </Text>
                <Text style={[styles.tableHeadCell, styles.flex1]}>PTS</Text>
                <Text style={[styles.tableHeadCell, styles.flex1_5]}>
                  AVG RESPONSE
                </Text>
                <Text style={[styles.tableHeadCell, styles.flex1_5]}>
                  AVG COMPLETION
                </Text>
              </View>

              {doc.subServices && doc.subServices.length > 0 ? (
                doc.subServices.map((sub, sIndex) => (
                  <View
                    key={sub.subServiceId || sIndex}
                    style={styles.tableDataRow}
                  >
                    <Text
                      style={[
                        styles.tableBodyText,
                        styles.flex2,
                        { fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {sub.subServiceName || 'Unnamed Service'}
                    </Text>
                    <Text style={[styles.tableBodyText, styles.flex1]}>
                      {sub.totalPatients || 0}
                    </Text>
                    <Text style={[styles.tableBodyText, styles.flex1_5]}>
                      {sub.avgResponseFormatted || '—'}
                    </Text>
                    <Text style={[styles.tableBodyText, styles.flex1_5]}>
                      {sub.avgCompletionFormatted || '—'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noActivityText}>
                  No activity in this period
                </Text>
              )}
            </View>
          ))}
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2.5),
  },
  timeframeContainer: {
    flex: 1.3,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 3,
    justifyContent: 'space-between',
  },
  timeframeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(0.8),
  },
  timeframeTabActive: {
    backgroundColor: '#0C4F51',
    borderRadius: 8,
  },
  timeframeText: {
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    color: '#64748B',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  dropdownSelector: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: responsiveHeight(1.0),
    paddingHorizontal: responsiveWidth(3),
    marginLeft: responsiveWidth(3),
  },
  dropdownText: {
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    color: '#1E293B',
  },
  scrollContent: {
    paddingBottom: responsiveHeight(14), // Space for absolute bottom tabs
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(1.5),
  },
  metricCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C4F51',
    borderRadius: 12,
    padding: responsiveWidth(3.5),
    marginBottom: responsiveHeight(1.5),
  },
  metricIconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: responsiveWidth(2),
    borderRadius: 8,
    marginRight: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTextContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#A9D6D7',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  doctorsListContainer: {
    paddingHorizontal: responsiveWidth(5),
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveWidth(4.5),
    marginBottom: responsiveHeight(2),
  },
  doctorCardDefault: {
    borderWidth: 1,
    borderColor: '#EBF1F1',
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  docInfoWrapper: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },
  docName: {
    fontSize: responsiveFontSize(1.65),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  docSpecialty: {
    fontSize: responsiveFontSize(1.3),
    color: '#64748B',
    fontWeight: '500',
  },
  docStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(1.8),
    width: '100%',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: responsiveFontSize(0.85),
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  vDivider: {
    width: 1,
    height: responsiveHeight(2.8),
    backgroundColor: '#E2E8F0',
    marginHorizontal: responsiveWidth(1.0),
  },
  cardHorizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: responsiveHeight(1.6),
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 6,
    marginBottom: responsiveHeight(1.5),
  },
  tableHeadCell: {
    fontSize: responsiveFontSize(0.95),
    fontWeight: '700',
    color: '#64748B',
  },
  flex2: {
    flex: 2,
  },
  flex1: {
    flex: 1,
    textAlign: 'center',
  },
  flex1_5: {
    flex: 1.5,
    textAlign: 'center',
  },
  noActivityText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#94A3B8',
    fontSize: responsiveFontSize(1.35),
    paddingVertical: responsiveHeight(1.5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalContent: {
    width: responsiveWidth(80),
    maxHeight: responsiveHeight(50),
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownModalTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#0C4F51',
    marginBottom: responsiveHeight(1.5),
  },
  dropdownList: {
    width: '100%',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(2),
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(1.7),
    color: '#334155',
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: '#0C4F51',
  },
  tableDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.0),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableBodyText: {
    fontSize: responsiveFontSize(1.35),
    color: '#334155',
  },
});

export default KPIReports;
