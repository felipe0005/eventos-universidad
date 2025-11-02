import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
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

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos Escolares</Text>
        <Text style={styles.role}>Hola, {user?.name}</Text>
      </View> 

      <FlatList
        data={events}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{new Date(item.date).toLocaleDateString("es-ES")}</Text>
            <Text>
              {" "}
              {new Date(item.date).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text>{item.location}</Text>
            <Text>Creado por: {item.created_by_name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No hay eventos disponibles</Text>
            <Text>Pulsa el botón + para crear el primer evento</Text>
          </View>
        }
      />

      {(user?.role === "admin" || user?.role === "teacher") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateEvent", { event: null })}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    color: "#666",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  eventCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  empty: {
    padding: 20,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
