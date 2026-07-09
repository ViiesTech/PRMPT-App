import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { AppColors } from '../../utils/AppColors';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/Slices';
import { setMessages, selectMessages } from '../../redux/ChatSlices';
import {
  useGetMessagesQuery,
  useCreateChatMutation,
  useSendMessageMutation,
} from '../../Services/ChatServices';
import { formatTime } from '../../utils/Utils';
import { getSocket } from '../../utils/Socket';

const ProviderChat = ({ navigation, route }) => {
  const contactName = route?.params?.name || 'Lauralee Quintero';
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const userData = useSelector(selectUser);

  const typingTimeoutRef = useRef(null);
  const [createChat] = useCreateChatMutation();
  const [sendMessageMutation, { isLoading: isSending }] = useSendMessageMutation();
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();

  const handleCreateChat = useCallback(async () => {
    await createChat({ recipientId: route.params.receiverId })
      .unwrap()
      .then(res => {
        if (res.success && res.chat?._id) {
          setChatId(res.chat._id);
        }
      })
      .catch(err => {
        console.log('Error creating/fetching chat:', err);
      });
  }, [createChat, route?.params?.receiverId]);

  // If chatId is not passed (e.g. from starting a new chat), create or fetch it
  useEffect(() => {
    if (!chatId && route?.params?.receiverId) {
      handleCreateChat();
    }
  }, [chatId, route?.params?.receiverId, handleCreateChat]);

  // Fetch messages with a 3-second polling interval for simple real-time updates
  const { data: messagesResponse, refetch } = useGetMessagesQuery(
    { chatId },
    {
      skip: !chatId,
      refetchOnMountOrArgChange: true,
      pollingInterval: 3000,
    },
  );

  // Clear messages on mount/chatId change, and store fetched messages in Redux
  useEffect(() => {
    dispatch(setMessages(null));
  }, [chatId, dispatch]);

  useEffect(() => {
    if (messagesResponse) {
      dispatch(setMessages(messagesResponse));
    }
  }, [messagesResponse, dispatch]);

  // Handle socket connections for realTime message sync and typing events
  useEffect(() => {
    const socket = getSocket();
    if (socket && chatId) {
      socket.emit('joinRoom', { roomId: chatId });
      console.log('[Socket] Joined room:', chatId);

      const handleNewMessage = () => {
        refetch();
      };

      const handleReconnect = () => {
        socket.emit('joinRoom', { roomId: chatId });
      };

      const onTyping = data => {
        console.log('[Socket] typing event data:', data);
        const senderId =
          data?.senderId?._id || data?.senderId || data?.userId || null;
        // Show typing indicator if the sender is not the current user
        if (!senderId || String(senderId) !== String(userData?._id)) {
          setIsTyping(true);
        }
      };

      const onStopTyping = data => {
        console.log('[Socket] stopTyping event data:', data);
        const senderId =
          data?.senderId?._id || data?.senderId || data?.userId || null;
        if (!senderId || String(senderId) !== String(userData?._id)) {
          setIsTyping(false);
        }
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('message', handleNewMessage);
      socket.on('typing', onTyping);
      socket.on('stopTyping', onStopTyping);
      socket.on('reconnect', handleReconnect);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('message', handleNewMessage);
        socket.off('typing', onTyping);
        socket.off('stopTyping', onStopTyping);
        socket.off('reconnect', handleReconnect);
        setIsTyping(false);
      };
    }
  }, [chatId, refetch, userData?._id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = text => {
    setInputText(text);
    const socket = getSocket();
    if (socket && chatId) {
      socket.emit('typing', { chatId, senderId: userData?._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { chatId, senderId: userData?._id });
      }, 2000);
    }
  };

  const formattedMessages = useMemo(() => {
    const rawMessages = messages || [];
    return rawMessages.map(msg => ({
      id: msg._id,
      text: msg.message || '',
      sender: msg.senderId?._id === userData?._id ? 'me' : 'other',
      time: formatTime(msg.createdAt),
    }));
  }, [messages, userData]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatId) return;
    const text = inputText.trim();
    setInputText('');

    const socket = getSocket();
    if (socket && chatId) {
      socket.emit('stopTyping', { chatId, senderId: userData?._id });
    }

    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('message', text);

      await sendMessageMutation(formData).unwrap();
      refetch();
    } catch (err) {
      console.log('Error sending message:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {contactName}
          </Text>
          {isTyping && (
            <Text style={styles.typingIndicatorText}>typing...</Text>
          )}
        </View>
      </View>

      {/* Chat Messages List */}
      <FlatList
        data={formattedMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Replies Button */}
      {/* <TouchableOpacity style={styles.quickRepliesBtn} activeOpacity={0.8}>
        <Feather name="more-horizontal" size={24} color="#FFFFFF" />
      </TouchableOpacity> */}

      {/* Keyboard/Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputAreaContainer}>
          <View style={styles.inputBoxWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              placeholderTextColor="#A0AEC0"
              value={inputText}
              onChangeText={handleInputChange}
              multiline={true}
            />
            <TouchableOpacity style={styles.clipButton} activeOpacity={0.7}>
              <Feather name="paperclip" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            activeOpacity={0.7}
            onPress={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="send" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop:
      Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
    paddingBottom: responsiveHeight(2),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: responsiveWidth(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#0C4F51',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
  typingIndicatorText: {
    fontSize: responsiveFontSize(1.3),
    color: '#10B981',
    fontWeight: '500',
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    marginBottom: responsiveHeight(1.8),
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: AppColors.primary,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.secondary,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  messageText: {
    fontSize: responsiveFontSize(1.55),
    color: '#FFFFFF',
    lineHeight: responsiveFontSize(2.2),
  },
  timeText: {
    fontSize: responsiveFontSize(1.05),
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  quickRepliesBtn: {
    width: 60,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#4D8E8E',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
  },
  inputAreaContainer: {
    backgroundColor: '#2A2D34',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3.5),
    marginRight: responsiveWidth(3.5),
  },
  inputField: {
    minHeight: responsiveHeight(5),
    flex: 1,
    paddingVertical:
      Platform.OS === 'ios' ? responsiveHeight(1.2) : responsiveHeight(0.8),
    fontSize: responsiveFontSize(1.5),
    color: '#1E293B',
    maxHeight: responsiveHeight(12),
    textAlignVertical: 'center',
  },
  clipButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProviderChat;
