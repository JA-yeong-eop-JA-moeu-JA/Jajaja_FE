import axios from 'axios';

import { reissue } from './auth/auth';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let hasHandledLogout = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const originalRequest = error.config;
    console.log(status, code);

    if (status === 401 && code === 'AUTH4011' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { isSuccess } = await reissue();
        if (isSuccess) {
          return axiosInstance(originalRequest);
        } else {
          throw new Error('토큰 재발급 실패');
        }
      } catch (e) {
        if (!hasHandledLogout) {
          hasHandledLogout = true;
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }
    if (status === 401 && code === 'AUTH4014') {
      if (!hasHandledLogout) {
        hasHandledLogout = true;
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (status >= 500) {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
