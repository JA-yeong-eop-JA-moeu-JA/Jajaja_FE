// src/apis/axiosInstance.ts - 쿠키 동기화 문제 해결
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: Array<(error?: any) => void> = [];

const subscribeTokenRefresh = (callback: (error?: any) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (error?: any) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status, data } = error.response || {};

    if (status === 401 && data?.code === 'AUTH4011') {
      console.log('AUTH4011 감지 - 토큰 재발급 시도');

      if (originalRequest._retry) {
        console.log('토큰 재발급 재시도 실패 - 로그인 페이지로 이동');
        alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        console.log('토큰 재발급 중 - 요청 대기');
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((refreshError) => {
            if (refreshError) {
              reject(refreshError);
            } else {
              resolve(axiosInstance(originalRequest));
            }
          });
        });
      }

      isRefreshing = true;
      console.log('토큰 재발급 시작');

      try {
        // 토큰 재발급 시도
        const reissueResponse = await axiosInstance.post('/api/auth/reissue');
        console.log('토큰 재발급 성공:', reissueResponse.status);

        // 🔥 중요: 쿠키가 업데이트될 시간을 주기 위해 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 재발급 성공 시 대기 중인 모든 요청 재실행
        onTokenRefreshed();

        // 현재 요청도 재실행
        return axiosInstance(originalRequest);
      } catch (reissueError: any) {
        console.log('토큰 재발급 실패:', reissueError);

        // 재발급 API 자체가 401이라면 완전히 만료된 것
        if (reissueError?.response?.status === 401) {
          onTokenRefreshed(reissueError);
          alert('세션이 완전히 만료되었습니다. 다시 로그인 해주세요.');
          window.location.href = '/login';
          return Promise.reject(reissueError);
        }

        // 다른 에러라면 한 번 더 시도해볼 수 있음
        onTokenRefreshed(reissueError);
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 500) {
      console.error('서버 에러:', error);
      alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    if (!error.response) {
      console.error('네트워크 에러:', error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
