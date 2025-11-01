import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// CAMBIA ESTA IP POR TU IP REAL
const API = axios.create({
  baseURL: "http://192.168.1.88:3000/api",
  timeout: 10000,
});

// Interceptor para agregar token
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
