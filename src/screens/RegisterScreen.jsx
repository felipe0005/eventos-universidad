import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/RegisterScreenStyle";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("🚀 Enviando registro...", {
        name: formData.name,
        email: formData.email,
      });

      const response = await fetch("http://192.168.1.88:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        }),
      });

      const data = await response.json();

      console.log("📨 Respuesta del registro:", data);

      if (data.success) {
        Alert.alert(
          "¡Registro Exitoso!",
          "Tu cuenta ha sido creada correctamente",
          [
            {
              text: "OK",
              onPress: () => {
                // Auto-login después del registro
                login(formData.email, formData.password);
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.error || "Error en el registro");
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
      Alert.alert("Error", "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Creando cuenta...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registro de Estudiante</Text>

        {/* Campo Nombre */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.name && { borderColor: "red" }]}
            placeholder="Nombre completo"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            editable={!loading}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email && { borderColor: "red" }]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Campo Contraseña */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password && { borderColor: "red" }]}
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            editable={!loading}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Campo Confirmar Contraseña */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.confirmPassword && { borderColor: "red" },
            ]}
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
            editable={!loading}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
