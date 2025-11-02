import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/eventsService";

export default function EventCreateScreen({ route, navigation }) {
  const { event: existingEvent } = route.params || {};
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing] = useState(!!existingEvent);

  useEffect(() => {
    if (existingEvent) {
      // Formatear fecha para el input
      const eventDate = new Date(existingEvent.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);

      setFormData({
        title: existingEvent.title || "",
        description: existingEvent.description || "",
        date: formattedDate,
        location: existingEvent.location || "",
      });
    }
  }, [existingEvent]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "El título es requerido");
      return false;
    }
    if (!formData.date) {
      Alert.alert("Error", "La fecha es requerida");
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert("Error", "La ubicación es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await eventsService.updateEvent(existingEvent.id, formData);
        Alert.alert("Éxito", "Evento actualizado correctamente");
      } else {
        await eventsService.createEvent(formData);
        Alert.alert("Éxito", "Evento creado correctamente");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().slice(0, 16);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
        </Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? "Modifica los detalles del evento"
            : "Completa la información para crear un nuevo evento"}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título del Evento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Feria de Ciencias 2024"
            value={formData.title}
            onChangeText={(text) => handleInputChange("title", text)}
            maxLength={100}
          />
          <Text style={styles.charCount}>{formData.title.length}/100</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el evento, actividades, requisitos..."
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {formData.description.length}/500
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha y Hora *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DDTHH:MM"
            value={formData.date}
            onChangeText={(text) => handleInputChange("date", text)}
          />
          <Text style={styles.helperText}>
            Formato: AAAA-MM-DDTHH:MM (Ej: 2024-03-15T14:30)
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Gimnasio principal, Auditorio..."
            value={formData.location}
            onChangeText={(text) => handleInputChange("location", text)}
            maxLength={100}
          />
          <Text style={styles.charCount}>{formData.location.length}/100</Text>
        </View>

        <View style={styles.requiredInfo}>
          <Text style={styles.requiredText}>* Campos requeridos</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? "Actualizar Evento" : "Crear Evento"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    padding: 15,
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
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  requiredInfo: {
    marginBottom: 20,
  },
  requiredText: {
    fontSize: 14,
    color: "#FF3B30",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#8E8E93",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
