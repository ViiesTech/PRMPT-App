import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/Slices';
import { setInboxList, selectInboxList } from '../../redux/ChatSlices';
import { useGetAllProfilesQuery } from '../../Services/OtherServices';
import { useGetChatsQuery } from '../../Services/ChatServices';
import { getSocket } from '../../utils/Socket';

const StaffMessages = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();
  const inboxList = useSelector(selectInboxList);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: chatsResponse, refetch } = useGetChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (chatsResponse) {
      dispatch(setInboxList(chatsResponse));
    }
  }, [chatsResponse, dispatch]);

  // Refresh inbox in real-time when any new message arrives via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = () => {
      refetch();
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('message', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('message', handleNewMessage);
    };
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const { data: profilesResponse } = useGetAllProfilesQuery({
    type: 'provider',
  });
  const profilesList = useMemo(
    () => profilesResponse?.data || [],
    [profilesResponse],
  );

  const formatTime = useCallback(dateStr => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date
        .toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase();
    } catch {
      return '';
    }
  }, []);

  // Formatted chats from the getChats endpoint
  const formattedChats = useMemo(() => {
    const rawChats = inboxList || [];
    return rawChats.map(chat => {
      const otherParticipantObj = chat.participants?.find(
        p => p.userId?._id !== userData?._id,
      );
      const otherParticipant = otherParticipantObj?.userId || chat.participant;
      return {
        _id: chat._id,
        name: otherParticipant?.fullName || 'Chat Partner',
        email: otherParticipant?.email || '',
        avatar: otherParticipant?.avatar || null,
        lastMsg: chat.lastMessage?.message || 'No messages yet',
        time: chat.lastMessage?.createdAt
          ? formatTime(chat.lastMessage.createdAt)
          : '',
        unreadCount: chat.unreadCount?.[userData?._id] || 0,
        participantId: otherParticipant?._id,
      };
    });
  }, [inboxList, userData, formatTime]);

  // Filter existing chats matching the query
  const matchedConversations = useMemo(() => {
    return debouncedQuery.trim()
      ? formattedChats.filter(c =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : formattedChats;
  }, [debouncedQuery, formattedChats]);

  // Filter profiles matching the query that do NOT have an existing chat
  const matchedProfiles = useMemo(() => {
    return debouncedQuery.trim()
      ? profilesList.filter(
          p =>
            p.fullName.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
            !formattedChats.some(
              c => c.name.toLowerCase() === p.fullName.toLowerCase(),
            ),
        )
      : [];
  }, [debouncedQuery, profilesList, formattedChats]);

  const hasMatchedConversations = matchedConversations.length > 0;
  const showNewProfiles =
    !hasMatchedConversations && matchedProfiles.length > 0;
  const showNoResults =
    !hasMatchedConversations &&
    matchedProfiles.length === 0 &&
    debouncedQuery.trim() !== '';

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
          placeholder="Search People Here..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!debouncedQuery.trim() && formattedChats.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather
              name="message-square"
              size={48}
              color="#94A3B8"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No chats available</Text>
            <Text style={styles.emptySubText}>
              Search for people to start a new conversation.
            </Text>
          </View>
        )}

        {hasMatchedConversations &&
          matchedConversations.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.conversationRow}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('StaffChat', {
                  name: item.name,
                  chatId: item._id,
                  receiverId: item.participantId,
                })
              }
            >
              {item.avatar ? (
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.avatarImage}
                  />
                </View>
              ) : (
                <View style={[styles.avatarContainer, styles.initialsAvatar]}>
                  <Text style={styles.initialsText}>
                    {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.textContainer}>
                <Text style={styles.senderName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMsg}
                </Text>
              </View>
              {(item.time || item.unreadCount > 0) && (
                <View style={styles.metaRight}>
                  {item.time ? (
                    <Text style={styles.timeText}>{item.time}</Text>
                  ) : null}
                  {item.unreadCount > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          ))}

        {showNewProfiles &&
          matchedProfiles.map((item, index) => {
            const initials = item.fullName
              ? item.fullName.charAt(0).toUpperCase()
              : 'U';
            return (
              <TouchableOpacity
                key={item._id || index}
                style={styles.conversationRow}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('StaffChat', {
                    name: item.fullName,
                    receiverId: item._id,
                  })
                }
              >
                {item.avatar ? (
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatarImage}
                    />
                  </View>
                ) : (
                  <View style={[styles.avatarContainer, styles.initialsAvatar]}>
                    <Text style={styles.initialsText}>{initials}</Text>
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.senderName} numberOfLines={1}>
                    {item.fullName}
                  </Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.email || 'Provider'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={() =>
                    navigation.navigate('StaffChat', {
                      name: item.fullName,
                      receiverId: item._id,
                    })
                  }
                >
                  <Feather name="send" size={16} color="#0C4F51" />
                  <Text style={styles.checkText}>Start Chat</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

        {showNoResults && (
          <View style={styles.noResultsContainer}>
            <Feather
              name="search"
              size={32}
              color="#94A3B8"
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>No chats or users found</Text>
          </View>
        )}
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
    textTransform: 'capitalize',
  },
  lastMessage: {
    fontSize: responsiveFontSize(1.4),
    color: '#64748B',
  },
  selectedConversationRow: {
    backgroundColor: '#E6F4F4',
  },
  initialsAvatar: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedInitialsAvatar: {
    backgroundColor: '#0C4F51',
  },
  initialsText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: '#475569',
  },
  selectedInitialsText: {
    color: '#FFFFFF',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(10),
  },
  noResultsText: {
    fontSize: responsiveFontSize(1.6),
    color: '#94A3B8',
    fontWeight: '500',
  },
  noResultsIcon: {
    marginBottom: 10,
  },
  startChatBtnContainer: {
    position: 'absolute',
    bottom:
      Platform.OS === 'ios' ? responsiveHeight(11.5) : responsiveHeight(10.5),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    backgroundColor: 'transparent',
  },
  metaRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: responsiveWidth(2),
  },
  timeText: {
    fontSize: responsiveFontSize(1.3),
    color: '#94A3B8',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#0C4F51',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.15),
    fontWeight: '700',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E6F4F4',
    borderWidth: 0.5,
    borderColor: '#0C4F51',
  },
  checkText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '700',
    color: '#0C4F51',
    marginLeft: responsiveWidth(1),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(15),
    paddingHorizontal: responsiveWidth(10),
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: responsiveFontSize(1.4),
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StaffMessages;
