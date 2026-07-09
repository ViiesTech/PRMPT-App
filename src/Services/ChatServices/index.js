import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const getChats = () => {
  return {
    url: Endpoints.getChats,
    method: apiMethods.get,
  };
};

const getMessages = params => {
  return {
    url: Endpoints.getMessages,
    method: apiMethods.get,
    params,
  };
};

const createChat = body => {
  return {
    url: Endpoints.createChat,
    method: apiMethods.post,
    body,
  };
};

const sendMessage = body => {
  return {
    url: Endpoints.sendMessage,
    method: apiMethods.post,
    body,
  };
};

export const ChatServices = baseApi.injectEndpoints({
  endpoints: build => ({
    getChats: build.query({ query: getChats }),
    getMessages: build.query({ query: getMessages }),
    createChat: build.mutation({ query: createChat }),
    sendMessage: build.mutation({ query: sendMessage }),
  }),
  overrideExisting: true,
});

export const {
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useCreateChatMutation,
  useSendMessageMutation,
} = ChatServices;
