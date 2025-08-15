import axios from 'axios';

import { openLoginModal } from '@/stores/modalStore';

import { reissue } from './auth/auth';

const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const axiosInstance = axios.create({
  // 프록시 사용 시 baseURL을 빈 문자열로 설정 (또는 조건부 설정)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.skipAuth) {
    config.withCredentials = false;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const cfg = error.config ?? {};
    const status = error.response?.status;
    const code = error.response?.data?.code;
    console.log(status, code);

    if (cfg.skipAuth || cfg.optionalAuth) {
      return Promise.reject(error);
    }

    if (status === 401 && code === 'AUTH4011') {
      try {
        if (!cfg._retry) {
          cfg._retry = true;
          const { isSuccess } = await reissue();
          if (isSuccess) return axiosInstance(cfg);
        }
      } catch {
        /* 무시 */
      }
      openLoginModal({ from: window.location.pathname });
      const authErr: any = new Error('AUTH_REQUIRED');
      authErr.authRequired = true;
      authErr.original = error;
      return Promise.reject(authErr);
    }

    if (status >= 500) {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
