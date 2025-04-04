import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const api = axios.create({
  baseURL: 'https://geneus-api.onrender.com',
});

let navigator; // Variable to store the navigation object

export const setNavigator = (nav) => {
  navigator = nav;
};

api.interceptors.request.use(async (config) => {
  console.log("Intercepting request:", config.url); 
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    console.log("Access Token:", token); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error retrieving access token:", error); 
  }
  return config;
}, (error) => {
  console.error("Request error:", error); 
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  console.log("Response received:", response.data); 
  return response;
}, async (error) => {
  console.error("Response error from private axios:", error.response.status, error.message); 
  
  const originalRequest = error.config;
  
  if (error.response && error.response.status === 403 && !originalRequest._retry) {
    console.log("Token expired, trying to refresh token..."); 
    originalRequest._retry = true;

    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      console.log("Refresh Token:", refreshToken); 
      
      const response = await axios.post('https://geneus-api.onrender.com/api/user/refresh', { refreshToken });
      const newAccessToken = response.data.accessToken;
      console.log("New Access Token:", newAccessToken);
      
      await SecureStore.setItemAsync('accessToken', newAccessToken);
      
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest); 
    } catch (err) {
      console.error("Failed to refresh token:", err); 
      
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      console.log("Tokens cleared after failed refresh.");
      
    
      if (navigator) {
        navigator.navigate('Login');
      }
    }
  }
  
  return Promise.reject(error); 
});

export default api;
