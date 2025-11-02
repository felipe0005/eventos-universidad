//imports necesarios para que funcione
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { testConnection } from "../utils/testConnection";
import { authService } from "../services/authService";
import styles from "../styles/LoginScreenStyle";

//funcion principal
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  //se maneja el Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    console.log("Iniciando login con:", { email, password });

    const result = await login(email, password);

    console.log("Resultado del login:", result);

    if (!result.success) {
      Alert.alert("Error", result.message);
    } else {
      console.log("Login exitoso, debería navegar automáticamente");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <Text style={styles.title}>Eventos Universitarios</Text>
          <Text style={styles.subtitle}>
            Conecta con tu comunidad universitaria
          </Text>
        </View>

        {/* Formulario de login */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu.correo@universidad.edu"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
              (!email || !password) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>
                Ingresar a la Plataforma
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta? Regístrate aquí
            </Text>
          </TouchableOpacity>

          <View style={styles.testData}>
            <Text style={styles.noteText}>
              * Los estudiantes deben registrarse. Profesores: cuentas
              institucionales.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
