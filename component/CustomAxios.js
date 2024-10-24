import axios from "axios"

const customAxios = axios.create({
    baseURL: 'https://geneus-api.onrender.com ', 
    headers: {
      'Content-Type': 'application/json', 
    },
  });
  
  export default customAxios;