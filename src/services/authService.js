import API from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      console.log("🚀 Enviando login...");
      const response = await API.post("/login", { email, password });
      console.log("✅ Login exitoso:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error en login:", error);
      throw error.response?.data || { message: "Error de conexión" };
    }
  },

  register: async (userData) => {
    try {
      console.log(" Registrando estudiante:", userData);
      const response = await API.post("/register", userData);
      console.log(" Registro exitoso:", response.data);
      return response.data;
    } catch (error) {
      console.log(" Error en registro:", error);
      throw error.response?.data || { message: "Error al crear la cuenta" };
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
};
