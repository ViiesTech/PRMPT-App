import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const verifyAccount = body => {
  return {
    url: Endpoints.verifyAccount,
    method: apiMethods.post,
    body,
  };
};

const verifyOTP = body => {
  return {
    url: Endpoints.verifyOTP,
    method: apiMethods.post,
    body,
  };
};

const setPassword = body => {
  return {
    url: Endpoints.setPassword,
    method: apiMethods.post,
    body,
  };
};

const forgotPassword = body => {
  return {
    url: Endpoints.forgotPassword,
    method: apiMethods.post,
    body,
  };
};

const login = body => {
  return {
    url: Endpoints.login,
    method: apiMethods.post,
    body,
  };
};

export const AuthService = baseApi.injectEndpoints({
  endpoints: build => ({
    verifyAccount: build.mutation({ query: verifyAccount }),
    verifyOTP: build.mutation({ query: verifyOTP }),
    setPassword: build.mutation({ query: setPassword }),
    forgotPassword: build.mutation({ query: forgotPassword }),
    login: build.mutation({ query: login }),
  }),
  overrideExisting: true,
});

export const {
  useVerifyAccountMutation,
  useVerifyOTPMutation,
  useSetPasswordMutation,
  useForgotPasswordMutation,
  useLoginMutation,
} = AuthService;
