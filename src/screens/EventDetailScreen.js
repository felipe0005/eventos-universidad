import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/eventsService";

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;
  const { user } = useAuth();

  const handleDeleteEvent = () => {
    if (!event.id) {
      Alert.alert("Error", "No se puede eliminar este evento");
      return;
    }

    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro de que quieres eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eventsService.deleteEvent(event.id);
              Alert.alert("Éxito", "Evento eliminado correctamente");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el evento");
            }
          },
        },
      ]
    );
  };

  const handleAddToCalendar = () => {
    // Simulación de agregar a calendario
    Alert.alert(
      "Agregar a Calendario",
      "¿Quieres agregar este evento a tu calendario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Agregar",
          onPress: () =>
            Alert.alert("Éxito", "Evento agregado a tu calendario"),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>📅 {formatDate(event.date)}</Text>
        <Text style={styles.location}>📍 {event.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {event.description ||
            "No hay descripción disponible para este evento."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Evento</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Creado por:</Text>
          <Text style={styles.infoValue}>
            {event.created_by_name || "Administración"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha de creación:</Text>
          <Text style={styles.infoValue}>
            {new Date(event.created_at).toLocaleDateString("es-ES")}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={handleAddToCalendar}
        >
          <Text style={styles.calendarButtonText}>📅 Agregar a Calendario</Text>
        </TouchableOpacity>

        {(user?.role === "admin" || user?.id === event.created_by) && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("CreateEvent", { event })}
            >
              <Text style={styles.editButtonText}>✏️ Editar Evento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteEvent}
            >
              <Text style={styles.deleteButtonText}>🗑️ Eliminar Evento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Para más información, contacta con la administración de la escuela.
        </Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 5,
    fontWeight: "500",
  },
  location: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
  actions: {
    padding: 15,
  },
  calendarButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  calendarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  adminActions: {
    gap: 10,
  },
  editButton: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});