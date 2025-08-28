import axios from 'axios';
import AuthStore from '../stores/AuthStore';

const Api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  withCredentials: true,
});

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND}/refresh-token`, {
      refreshToken,
    });

    return response.data.accessToken;
  } catch (err) {
    console.error('Gagal refresh token', err);
    throw err;
  }
}

Api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token && refreshToken && !config.url.includes('/refresh-token')) {
      try {
        token = await refreshAccessToken(refreshToken);
        localStorage.setItem('accessToken', token);
      } catch (error) {
        console.error('Gagal refresh token saat request', error);
        AuthStore.getState().setAuthenticated(false);
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh-token') // Hindari infinite loop
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          localStorage.setItem('accessToken', newAccessToken);

          Api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return Api(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token invalid, force logout');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          AuthStore.getState().setAuthenticated(false);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        AuthStore.getState().setAuthenticated(false);
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
