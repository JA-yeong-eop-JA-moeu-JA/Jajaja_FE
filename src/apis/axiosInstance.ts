import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};

    if (status === 401 && data?.code === 'AUTH4011') {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/home';
    }

    if (status === 500) {
      alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    return Promise.reject(data);
  },
);

export default axiosInstance;
