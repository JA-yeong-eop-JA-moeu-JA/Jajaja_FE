// src/apis/axiosInstance.ts

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // 🔥 fallback 추가
  withCredentials: true,
  timeout: 10000, // 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => {
    // 디버깅용 로그 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('✅ API 응답:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { status, data } = error.response || {};

    // 토큰 갱신 로직
    if (status === 401 && data?.code === 'AUTH4011') {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axiosInstance.post('/api/auth/reissue');
          return axiosInstance(originalRequest);
        } catch (reissueError) {
          alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
          window.location.href = '/login';
          return Promise.reject(reissueError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // 500 에러 처리
    if (status === 500) {
      console.error('❌ 서버 에러:', {
        url: error.config?.url,
        status: status,
        message: data?.message || '서버 에러가 발생했습니다.',
        result: data?.result, // 상세 에러 정보
      });

      // 개발 환경에서는 상세 에러 표시
      if (import.meta.env.DEV) {
        console.error('서버 에러 상세:', data);
        alert(`서버 에러: ${data?.message || '알 수 없는 오류'}\n상세: ${data?.result || ''}`);
      } else {
        alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
