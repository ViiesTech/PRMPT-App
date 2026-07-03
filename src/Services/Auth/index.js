import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const verifySignupOtp = body => {
  console.log('verifySignupOtp_body:-', body);
  return {
    url: Endpoints.verifySignupOtp,
    method: apiMethods.post,
    body,
  };
};
const login = body => {
  console.log('login_body:-', body);
  return {
    url: Endpoints.login,
    method: apiMethods.post,
    body,
  };
};
const forgotPassword = body => {
  console.log('forgetPassword_body:-', body);
  return {
    url: Endpoints.forgotPassword,
    method: apiMethods.post,
    body,
  };
};

export const AuthService = baseApi.injectEndpoints({
  endpoints: build => ({
    verifySignupOtp: build.mutation({ query: verifySignupOtp }),
    login: build.mutation({ query: login }),
    forgotPassword: build.mutation({ query: forgotPassword }),
  }),
  overrideExisting: true,
});

export const {
  useVerifySignupOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
} = AuthService;
