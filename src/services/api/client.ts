import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '@/types';

const BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1'
  : 'https://api.liftx.app/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };
    return Promise.reject(apiError);
  },
);

export default apiClient;

export const uploadFile = async (
  uri: string,
  type: string,
  name: string,
  onProgress?: (progress: number) => void,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', { uri, type, name } as any);
  const response = await apiClient.post('/storage/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  } as AxiosRequestConfig);
  return response.data.data;
};
