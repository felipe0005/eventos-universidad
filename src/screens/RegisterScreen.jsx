import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "", // Número de estudiante opcional
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre completo es requerido";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email institucional es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del email no es válido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, studentId, ...registerData } = formData;

      const response = await authService.register(registerData);

      if (response.success) {
        Alert.alert(
          "¡Registro Exitoso!",
          "Tu cuenta de estudiante ha sido creada correctamente",
          [
            {
              text: "Continuar",
              onPress: () => {
                // El AuthContext manejará la navegación automáticamente
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Registro de Estudiante</Text>
          <Text style={styles.subtitle}>
            Crea tu cuenta en Eventos Escolares
          </Text>
        </View>

        <View style={styles.form}>
          {/* Información importante */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🎓 Registro Exclusivo</Text>
            <Text style={styles.infoText}>
              Esta plataforma es solo para estudiantes. Los profesores recibirán
              sus cuentas directamente de la institución.
            </Text>
          </View>

          {/* Nombre Completo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ej: María González López"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email Institucional */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Institucional *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Ej: estudiante@institucion.edu"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <Text style={styles.helperText}>
              Usa tu email proporcionado por la institución
            </Text>
          </View>

          {/* Número de Estudiante (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Estudiante (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 20230001"
              value={formData.studentId}
              onChangeText={(text) => handleInputChange("studentId", text)}
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>
              Si tienes un número de estudiante, ingrésalo aquí
            </Text>
          </View>

          {/* Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry
              autoComplete="password-new"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirmar Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
              secureTextEntry
              autoComplete="password-new"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Botón de registro */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerButtonText}>
                Crear Cuenta de Estudiante
              </Text>
            )}
          </TouchableOpacity>

          {/* Enlace a login */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLinkText}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.termsBox}>
          <Text style={styles.termsTitle}>📋 Políticas de la Plataforma</Text>
          <Text style={styles.termsText}>
            • Solo estudiantes pueden registrarse{"\n"}• Los profesores reciben
            cuentas institucionales{"\n"}• Debes usar tu email institucional
            {"\n"}• La institución verifica todas las cuentas
          </Text>
        </View>

        {/* Contacto para profesores */}
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherTitle}>👨‍🏫 ¿Eres profesor?</Text>
          <Text style={styles.teacherText}>
            Contacta con la administración de tu institución para obtener tu
            cuenta de profesor.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBox: {
    backgroundColor: "#E8F5E8",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CD964",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 5,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  registerButton: {
    backgroundColor: "#4CD964",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLinkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  termsBox: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: "#007AFF",
    lineHeight: 18,
  },
  teacherInfo: {
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  teacherTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF9800",
    marginBottom: 8,
  },
  teacherText: {
    fontSize: 12,
    color: "#FF9800",
    lineHeight: 18,
  },
});
