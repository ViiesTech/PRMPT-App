import { createSlice } from '@reduxjs/toolkit';
import { setClearStore } from './Slices';

const initialState = {
  inboxList: null,
  messages: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInboxList: (state, action) => {
      state.inboxList = action.payload?.chats || [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload?.messages || [];
    },
  },
  extraReducers: builder => {
    builder.addCase(setClearStore, () => {
      return initialState;
    });
  },
});

export const { setInboxList, setMessages } = chatSlice.actions;

export const selectInboxList = state => state?.chat?.inboxList;
export const selectMessages = state => state?.chat?.messages;

export default chatSlice.reducer;
