// services/AuthService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://wordbrust-server.onrender.com/api/auth";

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor ile token ekleme
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthService = {
  async login(username, password, rememberMe) {
    try {
      const response = await api.post("/login", {
        email_or_username: username,
        user_password: password,
        remember_me: rememberMe,
      });
      console.log("Veri:", response.data);

      // Token'ı AsyncStorage'e kaydet
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );
        await AsyncStorage.setItem("userId", response.data.user.id.toString()); // 👈 Eklenen satır
      }

      return response;
    } catch (error) {
      console.log("Login error:", error);
      if (error.response) {
        throw new Error(error.response?.data?.error || "Login failed");
      } else {
        throw new Error("Login failed due to an unknown error");
      }
    }
  },

  async register(username, email, password) {
    try {
      const response = await api.post("/register", {
        username,
        email_address: email,
        user_password: password,
      });

      // Register sonrası otomatik login için
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );
        await AsyncStorage.setItem("userId", response.data.user.id.toString()); // 👈 Eklenen satır
      }

      return response.data;
    } catch (error) {
      console.log("Register error:", error);
      if (error.response) {
        throw new Error(error.response?.data?.error || "Registration failed");
      } else {
        throw new Error("Registration failed due to an unknown error");
      }
    }
  },

  async logout() {
    try {
      // 1. Sunucuya logout isteği gönder (opsiyonel)
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
        }
      );

      // 2. Yerel verileri temizle
      await AsyncStorage.multiRemove(["userToken", "userData"]);

      console.log("Çıkış başarılı");
      return true;
    } catch (error) {
      console.log("Çıkış hatası:", error);
      // Sunucu hatası olsa bile yerel verileri silmeye devam et
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      return false;
    }
  },

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.log("Get user error:", error);
      throw error;
    }
  },
};
