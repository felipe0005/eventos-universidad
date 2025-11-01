import API from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      console.log("🚀 Enviando login al backend...");
      const response = await API.post("/login", { email, password });
      console.log("✅ Respuesta del backend:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error en authService:", error);
      throw error.response?.data || { message: "Error de conexión" };
    }
  },

  register: async (userData) => {
    try {
      const response = await API.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error de conexión" };
    }
  },

  getProfile: async () => {
    try {
      const response = await API.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error de conexión" };
    }
  },

  testConnection: async () => {
    try {
      const response = await API.get("/test");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Error de conexión con el servidor" }
      );
    }
  },
};
