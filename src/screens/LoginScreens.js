import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { testConnection } from "../utils/testConnection";
import { authService } from "../services/authService"; // ✅ FALTABA ESTE IMPORT

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    console.log("🔄 Iniciando login con:", { email, password });

    const result = await login(email, password);

    console.log("📋 Resultado del login:", result);

    if (!result.success) {
      Alert.alert("Error", result.message);
    } else {
      console.log("✅ Login exitoso, debería navegar automáticamente");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Escolares</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      {/* Datos de prueba */}
      <View style={styles.testData}>
        <Text style={styles.testTitle}>Datos de prueba:</Text>
        <Text>admin@escuela.com</Text>
        <Text>teacher@escuela.com</Text>
        <Text>student@escuela.com</Text>
        <Text>Contraseña: password</Text>
        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.testButtonText}>🔌 Probar Conexión Backend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  testData: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  testTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  testButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  testButtonText: {
    color: "white",
    textAlign: "center",
  },
});
