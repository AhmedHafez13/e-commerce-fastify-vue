import axios, { AxiosError } from 'axios';
import { useOnline } from '@vueuse/core';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost'
});

const DEFAULT_MESSAGE =
  "Looks like you're offline. Please check your internet connection and reload the page to try again.";
const OFFLINE_MESSAGE = 'An error occurred. Please contact technical support for assistance.';

// Axios Response Interceptors
instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error: AxiosError) => {
    let message = OFFLINE_MESSAGE;

    if (error.response && error.response.data) {
      const data = error.response.data as any;
      message = data.message || data.error;
    } else if (!useOnline().value) {
      message = DEFAULT_MESSAGE;
    }
    return Promise.reject(message);
  }
);

export default Object.freeze(instance);
