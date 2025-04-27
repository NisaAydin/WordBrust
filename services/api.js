import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API URL
const API_URL = "https://wordbrust-server.onrender.com";

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
});

// Token'ı her istekte eklemek için request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken"); // Token'ı AsyncStorage'dan alıyoruz
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Token'ı Authorization başlığına ekliyoruz
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
