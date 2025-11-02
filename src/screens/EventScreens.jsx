import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/eventsService";

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsService.getEvents();
      setEvents(response.events || []);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "No se pudieron cargar los eventos"
      );
      console.log("Error loading events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      admin: "Administrador",
      teacher: "Docente",
      student: "Estudiante",
    };
    return roles[role] || role;
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Cargando eventos...</Text>
          <View style={styles.loadingSpinner} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
              <Text style={styles.userRole}>
                {getRoleDisplayName(user?.role)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos Universitarios</Text>
          <Text style={styles.sectionSubtitle}>
            Próximos eventos y actividades
          </Text>
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const { date, time, day } = formatEventDate(item.date);
            return (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() =>
                  navigation.navigate("EventDetails", { event: item })
                }
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>Dia:</Text>
                    <Text style={styles.detailText}>
                      {day}, {date}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>Hora:</Text>
                    <Text style={styles.detailText}>{time}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>Lugar:</Text>
                    <Text style={styles.detailText}>{item.location}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>Organizado por:</Text>
                    <Text style={styles.detailText}>
                      {item.created_by_name}
                    </Text>
                  </View>
                </View>

                <View style={styles.eventFooter}>
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {item.description || "Sin descripción disponible"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>No hay eventos programados</Text>
              <Text style={styles.emptyDescription}>
                {user?.role === "admin" || user?.role === "teacher"
                  ? "Presiona el botón + para crear el primer evento"
                  : "Los eventos aparecerán aquí cuando sean creados"}
              </Text>
            </View>
          }
        />
      </View>

      {/* FAB para crear eventos */}
      {(user?.role === "admin" || user?.role === "teacher") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateEvent", { event: null })}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 16,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#3B82F6",
    borderTopColor: "transparent",
    animation: "spin 1s linear infinite",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  logoutButton: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
  },
  listContent: {
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    flex: 1,
    marginRight: 12,
  },
  eventType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  eventDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});
