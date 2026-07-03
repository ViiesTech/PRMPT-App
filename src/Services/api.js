import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ApiConstants from '../Constants/Api.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setClearStore } from '../redux/Slices';

const baseQuery = fetchBaseQuery({
  baseUrl: ApiConstants.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    const contentType = getState()?.auth?.header;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // DO NOT REVERT: Removing manual 'application/json' allows fetchBaseQuery
    // to automatically set the correct header (including boundaries)
    // for both JSON and FormData requests.
    if (contentType && contentType !== 'application/json') {
      headers.set('Content-type', contentType);
    }

    return headers;
  },
});

const baseQueryWithLogout = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      AsyncStorage.removeItem('appleAuth').catch(err => console.error(err));
      api.dispatch(setClearStore());
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    return { error: { status: 500, message: 'Unexpected error' } };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});

export const apiMethods = {
  get: 'GET',
  post: 'POST',
  patch: 'PATCH',
  put: 'PUT',
  delete: 'DELETE',
};
