export const Endpoints = {
  verifyAccount: `auth/forgotPassword`,
  verifyOTP: `auth/verifyOtp`,
  setPassword: `auth/password`,
  forgotPassword: `auth/forgotPassword`,
  login: `auth/signin`,
  changePassword: `auth/password`,

  providerDashboard: `stats/dashboard`,
  kpiReports: `stats/kpi`,
  getAllServices: `service/getAllServices`,
  getAllBookings: `booking/getAllBookings`,
  updateBookingStatus: `booking/updateBookingStatus`,
  setBookingDelay: `booking/setBookingDelay`,
  getAllRooms: `room/getAllRooms`,
  getAllProfiles: `profile/getAllProfiles`,
  createBooking: `booking/createBooking`,

  getChats: `chat/getChat`,
  getMessages: `chat/getMessages`,
  createChat: `chat/getOrCreateChat`,
  sendMessage: `chat/sendMessage`,
};
