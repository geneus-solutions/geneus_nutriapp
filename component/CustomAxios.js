import axios from "axios"

const customAxios = axios.create({
    baseURL: 'http://192.168.0.105:8000', 
    headers: {
      'Content-Type': 'application/json', 
    },
  });
  
  export default customAxios;