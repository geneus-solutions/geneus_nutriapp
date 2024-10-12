import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const api = axios.create({
  baseURL: 'http://192.168.0.105:3000',
});


api.interceptors.request.use(async (config) => {
  console.log("Intercepting request:", config.url); 
  try {
    const token = await SecureStore.getItem('accessToken');
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
  console.error("Response error from private axios :", error.response.status, error.message); 
  
  const originalRequest = error.config;
  
  if (error.response && error.response.status === 500 && !originalRequest._retry) {
    console.log("Token expired, trying to refresh token..."); 
    originalRequest._retry = true;

    try {
      const refreshToken = await SecureStore.getItem('refreshToken');
      console.log("Refresh Token:", refreshToken); 
      
      const response = await axios.post('http://192.168.0.105:3000/api/user/refresh', { refreshToken });
      const newAccessToken = response.data.accessToken;
      console.log("New Access Token:", newAccessToken);
      
      await SecureStore.setItem('accessToken', newAccessToken);
      
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest); 
    } catch (err) {
      console.error("Failed to refresh token:", err); 
      
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      console.log("Tokens cleared after failed refresh.");
    
    }
  }
  
  return Promise.reject(error); 
});

export default api;
