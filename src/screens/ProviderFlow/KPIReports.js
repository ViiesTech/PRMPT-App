import React, { useState } from 'react';
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

const doctorsData = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Nephrologist',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop',
    patients: '0',
    avgResponse: '—',
    avgCompletion: '—',
  },
  {
    id: '2',
    name: 'Dr. James Okafor',
    specialty: 'Cardiologist',
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop',
    patients: '0',
    avgResponse: '—',
    avgCompletion: '—',
  },
  {
    id: '3',
    name: 'Dr. Priya Nair',
    specialty: 'Ophthalmologist',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop',
    patients: '0',
    avgResponse: '—',
    avgCompletion: '—',
  },
  {
    id: '4',
    name: 'Dr. Carlos Rivera',
    specialty: 'Dermatologist',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop',
    patients: '0',
    avgResponse: '—',
    avgCompletion: '—',
  },
];

const KPIReports = ({ navigation }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Day');

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
        <TouchableOpacity style={styles.dropdownSelector} activeOpacity={0.8}>
          <Text style={styles.dropdownText}>All Services</Text>
          <Feather name="chevron-down" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.metricValue}>0</Text>
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
              <Text style={styles.metricValue}>0</Text>
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
              <Text style={styles.metricValue}>0</Text>
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
              <Text style={styles.metricValue}>0</Text>
            </View>
          </View>
        </View>

        {/* Doctors Performance Cards List */}
        <View style={styles.doctorsListContainer}>
          {doctorsData.map(doc => (
            <View
              key={doc.id}
              style={[styles.doctorCard, styles.doctorCardDefault]}
            >
              {/* Doctor Details Row */}
              <View style={styles.docHeaderRow}>
                <Image source={{ uri: doc.avatar }} style={styles.docAvatar} />
                <View style={styles.docInfoWrapper}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                </View>
              </View>

              {/* Performance Stats Row */}
              <View style={styles.docStatsRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>{doc.patients}</Text>
                  <Text style={styles.statLabel}>PATIENTS</Text>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>{doc.avgResponse}</Text>
                  <Text style={styles.statLabel}>AVG RESPONSE</Text>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>{doc.avgCompletion}</Text>
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

              <Text style={styles.noActivityText}>
                No activity in this period
              </Text>
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
});

export default KPIReports;
