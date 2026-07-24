import { useToastStore } from '@/store/useToastStore';
import axios from 'axios';

const API_PREFIX = '/api';

// NOTE: axios(apis/)는 클라이언트 전용
// 서버 컴포넌트/Route Handler는 /api 를 거치지 않고 services/ 를 직접 호출해야 함
// (서버에서 자신의 /api 로 HTTP 재요청하는 것은 불필요한 왕복 + origin/쿠키 문제라 금지)
const baseURL = process.env.NEXT_PUBLIC_CLIENT_API_ORIGIN ?? API_PREFIX;

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
  timeout: 10_000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { showToast } = useToastStore.getState();
      showToast('세션이 만료되었습니다. 다시 로그인해 주세요.', 'error');

      // TODO: 토스트를 위한 리다이렉트 지연 필요?
      window.location.href = '/login?message=unauthorized';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
