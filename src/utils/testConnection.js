import { Alert } from "react-native";

export const testConnection = async () => {
  try {
    const response = await fetch("http://192.168.1.88:3000/api/test"); // Usa tu IP
    const data = await response.json();

    if (data.success) {
      Alert.alert("✅ Conexión exitosa", "Backend conectado correctamente");
      return true;
    } else {
      Alert.alert("❌ Error", data.error);
      return false;
    }
  } catch (error) {
    Alert.alert(
      "❌ Error de conexión",
      `No se pudo conectar al backend. Verifica:
      
1. ✅ Backend corriendo en puerto 3000
2. 📱 IP correcta en api.js
3. 🌐 Misma red WiFi
      
Error: ${error.message}`
    );
    return false;
  }
};
