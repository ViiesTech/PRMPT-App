import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const providerDashboard = () => {
  return {
    url: Endpoints.providerDashboard,
    method: apiMethods.get,
  };
};

const kpiReports = ({ period, subServiceId }) => {
  const params = { period };
  if (subServiceId && subServiceId !== 'all') {
    params.subServiceId = subServiceId;
  }
  return {
    url: Endpoints.kpiReports,
    method: apiMethods.get,
    params,
  };
};

const getAllServices = () => {
  return {
    url: Endpoints.getAllServices,
    method: apiMethods.get,
  };
};

const getAllBookings = ({ providerId, date, page, limit }) => {
  const params = { date, page, limit };
  if (providerId) {
    params.providerId = providerId;
  }
  return {
    url: Endpoints.getAllBookings,
    method: apiMethods.get,
    params,
  };
};

const updateBookingStatus = body => {
  return {
    url: Endpoints.updateBookingStatus,
    method: apiMethods.patch,
    body,
  };
};

const setBookingDelay = body => {
  return {
    url: Endpoints.setBookingDelay,
    method: apiMethods.patch,
    body,
  };
};

const getAllRooms = ({ available }) => {
  return {
    url: Endpoints.getAllRooms,
    method: apiMethods.get,
    params: { available },
  };
};

const getAllProfiles = (params = {}) => {
  return {
    url: Endpoints.getAllProfiles,
    method: apiMethods.get,
    params,
  };
};

const createBooking = body => {
  return {
    url: Endpoints.createBooking,
    method: apiMethods.post,
    body,
  };
};

const updateProfile = body => {
  return {
    url: Endpoints.updateProfile,
    method: apiMethods.patch,
    body,
  };
};

export const OtherServices = baseApi.injectEndpoints({
  endpoints: build => ({
    providerDashboard: build.query({ query: providerDashboard }),
    kpiReports: build.query({ query: kpiReports }),
    getAllServices: build.query({ query: getAllServices }),
    getAllBookings: build.query({ query: getAllBookings }),
    updateBookingStatus: build.mutation({ query: updateBookingStatus }),
    setBookingDelay: build.mutation({ query: setBookingDelay }),
    getAllRooms: build.query({ query: getAllRooms }),
    getAllProfiles: build.query({ query: getAllProfiles }),
    createBooking: build.mutation({ query: createBooking }),
    updateProfile: build.mutation({ query: updateProfile }),
  }),
  overrideExisting: true,
});

export const {
  useProviderDashboardQuery,
  useLazyProviderDashboardQuery,
  useKpiReportsQuery,
  useLazyKpiReportsQuery,
  useGetAllServicesQuery,
  useLazyGetAllServicesQuery,
  useGetAllBookingsQuery,
  useLazyGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useSetBookingDelayMutation,
  useGetAllRoomsQuery,
  useLazyGetAllRoomsQuery,
  useGetAllProfilesQuery,
  useLazyGetAllProfilesQuery,
  useCreateBookingMutation,
  useUpdateProfileMutation,
} = OtherServices;
