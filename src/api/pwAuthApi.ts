import axiosInstance from './axiosInstance';

export const sendOTP = (email: string) => {
  return axiosInstance.post('auth/password-reset/request-otp/', { email });
};

export const verifyOTP = (email: string, otp: string) => {
  return axiosInstance.post('auth/password-reset/verify-otp/', { email, otp });
};

export const resetPassword = (
  email: string,
  new_password: string,
  confirm_password: string,
  otp: string,
) => {
  return axiosInstance.post('auth/password-reset/verify-otp/', {
    email,
    otp,
    new_password,
    confirm_password,
  });
};

const fetchProfile = async () => {
  const res = await axiosInstance.get('auth/user/');
  return res.data;
};

export default fetchProfile;
