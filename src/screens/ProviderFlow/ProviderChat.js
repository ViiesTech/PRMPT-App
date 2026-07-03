import React, { useState } from 'react';
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
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { AppColors } from '../../utils/AppColors';

const initialMessages = [
  {
    id: '1',
    text: 'Let me know when reached',
    sender: 'other',
    time: '9:42 am',
  },
  {
    id: '2',
    text: "I'm here",
    sender: 'me',
    time: '9:42 am',
  },
];

const ProviderChat = ({ navigation, route }) => {
  const contactName = route?.params?.name || 'Lauralee Quintero';
  const [messagesList, setMessagesList] = useState(initialMessages);
  const [inputText, setInputText] = useState('Hello where');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: String(messagesList.length + 1),
      text: inputText.trim(),
      sender: 'me',
      time: new Date()
        .toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toLowerCase(),
    };
    setMessagesList([...messagesList, newMsg]);
    setInputText('');
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
        <Text style={styles.headerTitle}>{contactName}</Text>
      </View>

      {/* Chat Messages List */}
      <FlatList
        data={messagesList}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Replies Button */}
      <TouchableOpacity style={styles.quickRepliesBtn} activeOpacity={0.8}>
        <Feather name="more-horizontal" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
              onChangeText={setInputText}
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
          >
            <Feather name="send" size={24} color="#FFFFFF" />
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
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: '#0C4F51',
    letterSpacing: 0.2,
  },
  messagesList: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 12,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    marginBottom: responsiveHeight(1.8),
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: AppColors.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.secondary,
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
