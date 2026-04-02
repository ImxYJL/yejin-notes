import { useToastStore } from '@/store/useToastStore';
import axios from 'axios';

const API_PREFIX = '/api';
const normalizeUrl = (s?: string) => (s ?? '').replace(/\/+$/, ''); // 중복 슬래시 제거용

const isServer = typeof window === 'undefined';

const serverOrigin =
  normalizeUrl(process.env.NEXT_SERVER_API_ORIGIN) || 'http://localhost:3000';
const clientBase = process.env.NEXT_PUBLIC_CLIENT_API_ORIGIN ?? API_PREFIX;

// 서버: http://localhost:3000 + /api
// 클라이언트: 기본적으로 /api
const baseURL = isServer
  ? `${serverOrigin}${API_PREFIX}`
  : clientBase.startsWith('/')
    ? clientBase
    : `${API_PREFIX}${clientBase ? `/${clientBase}` : ''}`;

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

      if (!isServer) {
        // TODO: 토스트를 위한 리다이렉트 지연 필요?
        window.location.href = '/login?message=unauthorized';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
