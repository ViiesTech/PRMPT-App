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
  TextInput,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';

const conversations = [
  {
    name: 'Lauralee Quintero',
    lastMsg: 'You: Okay! Thanks Lauralee',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  },
  {
    name: 'Annabel Rohan',
    lastMsg: 'You: Hello Annabel',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'Alfonzo Schuessler',
    lastMsg: 'You: Okay! Thanks Alfonzo',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Augustina Midgett',
    lastMsg: 'You: Hello Augustina',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
  },
  {
    name: 'Freida Varnes',
    lastMsg: 'You: Okay! Thanks Freida',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    name: 'Francene Vandyne',
    lastMsg: 'You: Hello Francene',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  },
  {
    name: 'Geoffrey Mott',
    lastMsg: 'Okay! Thanks Geoffrey',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    name: 'Rayford Chenail',
    lastMsg: 'You: Hello Rayford',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  },
];

const ProviderMessages = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={20}
          color="#94A3B8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Messages"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Conversations List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {conversations.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.conversationRow}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('ProviderChat', { name: item.name })
            }
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.senderName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMsg}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  searchBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0C4F51',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    marginHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2.5),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical:
      Platform.OS === 'ios' ? responsiveHeight(1.5) : responsiveHeight(1.0),
    fontSize: responsiveFontSize(1.5),
    color: '#1A202C',
  },
  scrollContent: {
    paddingBottom: responsiveHeight(14), // Room for bottom absolute tab bar
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.8),
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#F5F7FA', // matches list backdrop
  },
  avatarContainer: {
    marginRight: responsiveWidth(4),
  },
  avatarImage: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
  },
  textContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: responsiveFontSize(1.4),
    color: '#64748B',
  },
});

export default ProviderMessages;
