import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: 'https://api.fxratesapi.com/latest'
  // baseURL: 'https://api.exchangerate-api.com/v4/latest/'
  // baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`
})

export default api;