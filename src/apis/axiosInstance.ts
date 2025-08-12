import axios from 'axios';

export const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, withCredentials: true });
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);
let isRefreshing = false;
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status, data } = error.response || {};
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
    if (status === 500) {
      alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
