import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AppButton from '../../componets/AppButton';
import { AppColors } from '../../utils/AppColors';
import {
  useGetAllServicesQuery,
  useGetAllRoomsQuery,
  useGetAllProfilesQuery,
  useCreateBookingMutation,
} from '../../Services/OtherServices';
import AppLoader from '../../componets/AppLoader';
import { showToast } from '../../utils/ShowToast';

const serviceThemes = {
  exams: {
    color: '#06B6D4',
    bg: '#E0F7FA',
    itemBg: '#F0FDFA',
    itemBorder: '#CCFBF1',
  },
  anesthesia: {
    color: '#EF4444',
    bg: '#FEE2E2',
    itemBg: '#FFF5F5',
    itemBorder: '#FED7D7',
  },
  restorative: {
    color: '#8B5CF6',
    bg: '#EDE9FE',
    itemBg: '#F5F3FF',
    itemBorder: '#E9D5FF',
  },
  financial: {
    color: '#10B981',
    bg: '#D1FAE5',
    itemBg: '#F0FDF4',
    itemBorder: '#A7F3D0',
  },
  misc: {
    color: '#A99889',
    bg: '#E5DACE',
    itemBg: '#F9F7F5',
    itemBorder: '#E5DACE',
  },
};

const defaultTheme = {
  color: '#A99889',
  bg: '#E5DACE',
  itemBg: '#F9F7F5',
  itemBorder: '#E5DACE',
};

// Dynamic provider and room data will be fetched via hooks

const PageProvider = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(null);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [newToOffice, setNewToOffice] = useState(false);
  const [newToProvider, setNewToProvider] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: servicesResponse, isLoading } = useGetAllServicesQuery();
  const { data: providersResponse, isLoading: isLoadingProviders } =
    useGetAllProfilesQuery({ type: 'provider' });
  const { data: roomsResponse, isLoading: isLoadingRooms } =
    useGetAllRoomsQuery({ available: true });
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();

  const mappedProviders = useMemo(() => {
    const providersList = providersResponse?.data || [];
    return providersList.map(item => ({
      label: item.fullName,
      value: item._id,
    }));
  }, [providersResponse?.data]);

  const mappedRooms = useMemo(() => {
    const roomsList = roomsResponse?.data || [];
    return roomsList.map(item => ({
      label: `Room ${String(item.roomNo).padStart(2, '0')}`,
      value: item._id,
    }));
  }, [roomsResponse?.data]);

  const dynamicCategories = useMemo(() => {
    const servicesList = servicesResponse?.data || [];
    return servicesList.map(service => {
      const nameLower = service.serviceName.trim().toLowerCase();

      let themeKey = 'misc';
      let icon = 'search';

      if (nameLower.includes('new service') || nameLower.includes('exam')) {
        themeKey = 'exams';
        icon = 'search';
      } else if (nameLower.includes('anesthesia')) {
        themeKey = 'anesthesia';
        icon = 'syringe';
      } else if (nameLower.includes('restorative')) {
        themeKey = 'restorative';
        icon = 'wrench';
      } else if (nameLower.includes('financial')) {
        themeKey = 'financial';
        icon = 'dollar-sign';
      } else if (nameLower.includes('misc')) {
        themeKey = 'misc';
        icon = 'ellipsis-h';
      } else {
        themeKey = 'default';
        icon = service.icon || 'search';
      }

      const theme = serviceThemes[themeKey] || defaultTheme;

      return {
        _id: service._id,
        label: service.serviceName,
        icon: icon,
        color: theme.color,
        bg: theme.bg,
        itemBg: theme.itemBg,
        itemBorder: theme.itemBorder,
        subServices: service.subServicesId || [],
      };
    });
  }, [servicesResponse?.data]);

  useEffect(() => {
    if (dynamicCategories.length > 0 && !selectedTab) {
      setSelectedTab(dynamicCategories[0]._id);
    }
  }, [dynamicCategories, selectedTab]);

  const activeCategory =
    dynamicCategories.find(c => c._id === selectedTab) || dynamicCategories[0];
  const items = activeCategory?.subServices || [];

  if (isLoading && !servicesResponse) {
    return <AppLoader />;
  }

  const openModal = item => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    // Reset form states
    setPatientName('');
    setSelectedProvider('');
    setSelectedRoom('');
    setAdditionalNotes('');
    setNewToOffice(false);
    setNewToProvider(false);
    setSelectedItem(null);
  };

  const handleAddToQueue = async () => {
    if (!patientName.trim()) {
      showToast('Validation Error', 'Please enter the patient name.');
      return;
    }
    if (!selectedProvider) {
      showToast('Validation Error', 'Please select a provider.');
      return;
    }
    if (!selectedRoom) {
      showToast('Validation Error', 'Please select a room.');
      return;
    }
    if (!additionalNotes.trim()) {
      showToast('Validation Error', 'Please enter additional notes.');
      return;
    }

    try {
      const response = await createBooking({
        patientName: patientName.trim(),
        subServiceId: selectedItem?._id,
        providerId: selectedProvider,
        roomId: selectedRoom,
        newToClinic: newToOffice,
        newToProvider: newToProvider,
        note: additionalNotes.trim(),
      }).unwrap();

      if (response?.success) {
        showToast(
          'Success',
          response?.message ||
            `${patientName} has been successfully added to the queue for ${selectedItem?.subServiceName}.`,
          'success',
        );
        closeModal();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to add booking.',
          'error',
        );
      }
    } catch (error) {
      console.error('Create Booking Error:', error);
      showToast(
        'Error',
        error?.data?.message || 'An error occurred while creating booking.',
        'error',
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
        <Text style={styles.headerTitle}>Page Provider</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Horizontal Category Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {dynamicCategories.map(cat => {
            const isSelected = cat._id === selectedTab;
            return (
              <TouchableOpacity
                key={cat._id}
                onPress={() => setSelectedTab(cat._id)}
                style={styles.tabContainer}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBlock,
                    { backgroundColor: cat.bg },
                    isSelected && [
                      styles.iconBlockSelected,
                      { borderColor: cat.color },
                    ],
                  ]}
                >
                  <FontAwesome5 name={cat.icon} size={22} color={cat.color} />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isSelected
                      ? [styles.tabLabelSelected, { color: cat.color }]
                      : styles.tabLabelInactive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>{activeCategory?.label}</Text>

          {/* List Items */}
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.itemRow,
                {
                  backgroundColor: activeCategory?.itemBg,
                  borderColor: activeCategory?.itemBorder,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => openModal(item)}
            >
              <View
                style={[
                  styles.itemLeftIconBlock,
                  { backgroundColor: activeCategory?.bg },
                ]}
              >
                <FontAwesome5
                  name={activeCategory?.icon}
                  size={15}
                  color={activeCategory?.color}
                />
              </View>

              <Text style={styles.itemTitle}>{item.subServiceName}</Text>

              <View
                style={[
                  styles.itemRightCircle,
                  { backgroundColor: activeCategory?.color },
                ]}
              >
                <FontAwesome5
                  name="chevron-right"
                  size={11}
                  color={AppColors.white}
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Pop-up Form Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={styles.modalCard}>
              {/* Close Cross Button on Top Right */}
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeCrossButton}
                activeOpacity={0.7}
              >
                <Feather name="x" size={22} color="#94A3B8" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: responsiveHeight(75), width: '100%' }}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalHeaderIconBlock,
                      { backgroundColor: activeCategory?.bg },
                    ]}
                  >
                    <FontAwesome5
                      name={activeCategory?.icon}
                      size={20}
                      color={activeCategory?.color}
                    />
                  </View>
                  <View style={styles.modalHeaderTitleBlock}>
                    <Text
                      style={[
                        styles.modalCategoryText,
                        { color: activeCategory?.color },
                      ]}
                    >
                      {activeCategory?.label}
                    </Text>
                    <Text style={styles.modalItemTitleText}>
                      {selectedItem?.subServiceName}
                    </Text>
                  </View>
                </View>

                {/* Form Fields */}
                {/* Patient Name */}
                <Text style={styles.inputLabel}>
                  Patient Name<Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Full name..."
                  placeholderTextColor="#A0AEC0"
                  value={patientName}
                  onChangeText={setPatientName}
                />

                {/* Provider and Room in a Row */}
                <View style={styles.rowContainer}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>
                      Provider<Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={mappedProviders}
                      maxHeight={200}
                      labelField="label"
                      valueField="value"
                      placeholder={
                        isLoadingProviders
                          ? 'Loading providers...'
                          : 'Select provider...'
                      }
                      value={selectedProvider}
                      onChange={item => setSelectedProvider(item.value)}
                      containerStyle={styles.dropdownContainer}
                      activeColor="#F0FDFA"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>
                      Room<Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={mappedRooms}
                      maxHeight={200}
                      labelField="label"
                      valueField="value"
                      placeholder={
                        isLoadingRooms ? 'Loading rooms...' : 'Select room...'
                      }
                      value={selectedRoom}
                      onChange={item => setSelectedRoom(item.value)}
                      containerStyle={styles.dropdownContainer}
                      activeColor="#F0FDFA"
                    />
                  </View>
                </View>

                {/* Additional Notes */}
                <Text style={styles.inputLabel}>
                  Additional Notes<Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  placeholder="Any relevant notes..."
                  placeholderTextColor="#A0AEC0"
                  multiline={true}
                  numberOfLines={4}
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                />

                {/* Checkboxes Row */}
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setNewToOffice(!newToOffice)}
                    style={[
                      styles.checkboxCard,
                      { marginRight: responsiveWidth(3) },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        newToOffice && styles.checkboxChecked,
                      ]}
                    >
                      {newToOffice && (
                        <Feather
                          name="check"
                          size={11}
                          color={AppColors.white}
                        />
                      )}
                    </View>
                    <View style={styles.checkboxTextContainer}>
                      <Text style={styles.checkboxLabel} numberOfLines={1}>
                        New to Office
                      </Text>
                      <Text style={styles.checkboxSubtext} numberOfLines={1}>
                        First time patient
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setNewToProvider(!newToProvider)}
                    style={styles.checkboxCard}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        newToProvider && styles.checkboxChecked,
                      ]}
                    >
                      {newToProvider && (
                        <Feather
                          name="check"
                          size={11}
                          color={AppColors.white}
                        />
                      )}
                    </View>

                    <View style={styles.checkboxTextContainer}>
                      <Text style={styles.checkboxLabel} numberOfLines={1}>
                        New to Provider
                      </Text>
                      <Text style={styles.checkboxSubtext} numberOfLines={1}>
                        First visit this provider
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <AppButton
                    title="Add to Queue"
                    onPress={handleAddToQueue}
                    gradient={true}
                    variant="primary"
                    showArrow={true}
                    fontSize={1.5}
                    style={styles.confirmButton}
                    loading={isCreatingBooking}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
    paddingHorizontal: responsiveWidth(4.5),
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(14),
  },
  tabsScrollContent: {
    paddingVertical: responsiveHeight(1),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tabContainer: {
    alignItems: 'center',
    marginRight: responsiveWidth(3.8),
  },
  iconBlock: {
    width: responsiveWidth(14.5),
    height: responsiveWidth(14.5),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.8),
  },
  tabLabel: {
    fontSize: responsiveFontSize(1.25),
    textAlign: 'center',
  },
  tabLabelInactive: {
    color: '#718096',
    fontWeight: '500',
  },
  tabLabelSelected: {
    fontWeight: '700',
  },
  iconBlockSelected: {
    borderWidth: 1.5,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveWidth(5),
    marginTop: responsiveHeight(2.5),
    borderWidth: 1,
    borderColor: '#F0F4F4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: responsiveHeight(2.2),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(1.6),
    marginBottom: responsiveHeight(1.5),
  },
  itemLeftIconBlock: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3.5),
  },
  itemTitle: {
    flex: 1,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#1A202C',
  },
  itemRightCircle: {
    width: responsiveWidth(6.5),
    height: responsiveWidth(6.5),
    borderRadius: responsiveWidth(3.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 1.5,
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: responsiveWidth(5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  modalHeaderIconBlock: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3.5),
  },
  modalHeaderTitleBlock: {
    flex: 1,
  },
  modalCategoryText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalItemTitleText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '600',
    color: '#0F4E50',
    marginBottom: responsiveHeight(0.8),
    marginTop: responsiveHeight(1.8),
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#FAFBFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical:
      Platform.OS === 'ios' ? responsiveHeight(1.5) : responsiveHeight(1.0),
    fontSize: responsiveFontSize(1.4),
    color: '#1A202C',
  },
  notesInput: {
    height: responsiveHeight(10),
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dropdown: {
    backgroundColor: '#FAFBFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3.5),
    height:
      Platform.OS === 'ios' ? responsiveHeight(5.2) : responsiveHeight(5.5),
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.4),
    color: '#A0AEC0',
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.4),
    color: '#1A202C',
  },
  dropdownContainer: {
    borderRadius: 10,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2.5),
  },
  checkboxCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1.4),
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
  },
  checkboxChecked: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
    color: '#1A202C',
  },
  checkboxSubtext: {
    fontSize: responsiveFontSize(1.0),
    color: '#718096',
    marginTop: 2,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 0.9,
    height: responsiveHeight(6.8),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    color: '#94A3B8',
  },
  confirmButton: {
    flex: 1.2,
    width: 'auto',
    marginBottom: 0,
    marginLeft: responsiveWidth(4),
  },
  confirmButtonText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnArrowIcon: {
    marginLeft: 6,
  },
  closeCrossButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
});

export default PageProvider;
