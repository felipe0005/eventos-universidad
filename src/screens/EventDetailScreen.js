import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
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
      "¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.",
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
    return {
      full: date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      day: date.toLocaleDateString("es-ES", { weekday: "long" }),
    };
  };

  const eventDate = formatDate(event.date);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con imagen de fondo */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.heroDetails}>
              <View style={styles.heroDetailItem}>
                <Text style={styles.heroDetailIcon}>📅</Text>
                <Text style={styles.heroDetailText}>
                  {eventDate.day}, {eventDate.date}
                </Text>
              </View>
              <View style={styles.heroDetailItem}>
                <Text style={styles.heroDetailIcon}>🕒</Text>
                <Text style={styles.heroDetailText}>{eventDate.time}</Text>
              </View>
              <View style={styles.heroDetailItem}>
                <Text style={styles.heroDetailIcon}>📍</Text>
                <Text style={styles.heroDetailText}>{event.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contenido Principal */}
        <View style={styles.content}>
          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción del Evento</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.description}>
                {event.description ||
                  "No hay descripción disponible para este evento."}
              </Text>
            </View>
          </View>

          {/* Información Detallada */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Evento</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>👤</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organizador</Text>
                  <Text style={styles.infoValue}>
                    {event.created_by_name || "Administración"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>📝</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Fecha de Creación</Text>
                  <Text style={styles.infoValue}>
                    {new Date(event.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🎯</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tipo de Evento</Text>
                  <Text style={styles.infoValue}>
                    {event.type === "academico"
                      ? "Evento Académico"
                      : "Evento Social"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones</Text>
            <View style={styles.actionsCard}>
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={handleAddToCalendar}
              >
                <View style={styles.calendarButtonTextContainer}>
                  <Text style={styles.calendarButtonTitle}>
                    Agregar a Calendario
                  </Text>
                  <Text style={styles.calendarButtonSubtitle}>
                    Guardar en tu agenda personal
                  </Text>
                </View>
              </TouchableOpacity>

              {(user?.role === "admin" || user?.id === event.created_by) && (
                <View style={styles.adminActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      navigation.navigate("CreateEvent", { event })
                    }
                  >
                    <View style={styles.editButtonTextContainer}>
                      <Text style={styles.editButtonTitle}>Editar Evento</Text>
                      <Text style={styles.editButtonSubtitle}>
                        Modificar información del evento
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteEvent}
                  >
                    <View style={styles.deleteButtonTextContainer}>
                      <Text style={styles.deleteButtonTitle}>
                        Eliminar Evento
                      </Text>
                      <Text style={styles.deleteButtonSubtitle}>
                        Eliminar permanentemente
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Footer Informativo */}
          <View style={styles.footerSection}>
            <View style={styles.footerCard}>
              <Text style={styles.footerTitle}>Información Importante</Text>
              <Text style={styles.footerText}>
                Para más información sobre este evento o si tienes alguna
                pregunta, contacta con la administración de la universidad.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: {
    alignItems: "flex-start",
  },
  eventTypeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  eventTypeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    lineHeight: 34,
  },
  heroDetails: {
    width: "100%",
  },
  heroDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  heroDetailIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  heroDetailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
  descriptionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoItemLast: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  actionsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    marginBottom: 16,
  },
  calendarButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  calendarButtonTextContainer: {
    flex: 1,
  },
  calendarButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 2,
  },
  calendarButtonSubtitle: {
    fontSize: 12,
    color: "#16A34A",
  },
  adminActions: {
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  editButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  editButtonTextContainer: {
    flex: 1,
  },
  editButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 2,
  },
  editButtonSubtitle: {
    fontSize: 12,
    color: "#D97706",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  deleteButtonTextContainer: {
    flex: 1,
  },
  deleteButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#991B1B",
    marginBottom: 2,
  },
  deleteButtonSubtitle: {
    fontSize: 12,
    color: "#DC2626",
  },
  footerSection: {
    marginTop: 8,
  },
  footerCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    alignItems: "center",
  },
  footerIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 8,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
});
