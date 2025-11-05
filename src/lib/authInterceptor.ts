import { AxiosError, AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { apiClient, setAccessTokenHeader } from "./apiClient";
import { store } from "../app/store/store";
import { setAccessToken, clearAuth } from "../app/slices/auth.slice";
import { refreshApi } from "../app/api/auth.api";

let isRefreshing = false;
let waitingQueue: Array<(token: string | null) => void> = [];

const notifyQueue = (newToken: string | null): void => {
  waitingQueue.forEach((callback) => callback(newToken));
  waitingQueue = [];
}

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const statusCode = error.response?.status ?? 0;

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingQueue.push((latestToken) => {
            if (!originalRequest.headers) {
              originalRequest.headers = new AxiosHeaders();
            }
            if (latestToken) {
              (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${latestToken}`);
            }
            apiClient.request(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        const data = await refreshApi(); 
        store.dispatch(setAccessToken(data.accessToken));
        setAccessTokenHeader(data.accessToken);
        notifyQueue(data.accessToken);

        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders();
        }
        (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${data.accessToken}`);

        return apiClient.request(originalRequest);
      } catch (refreshError) {
        notifyQueue(null);
        store.dispatch(clearAuth());
        setAccessTokenHeader(null);
        localStorage.removeItem("auth");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
