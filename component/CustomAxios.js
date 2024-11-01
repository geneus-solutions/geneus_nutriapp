import axios from 'axios';

const customAxios = axios.create({
  baseURL: 'https://geneus-api.onrender.com',
 
});

customAxios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
}, error => {
  console.log('Request Error:', error);
  return Promise.reject(error);
});

customAxios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.log('Response Error:', error);
  if (error.response) {
    console.log('Error Response Data:', error.response.data);
    console.log('Error Response Status:', error.response.status);
  } else if (error.request) {
    console.log('No response received:', error.request);
  } else {
    console.log('Axios Error:', error.message);
  }
  return Promise.reject(error);
});

export default customAxios;
