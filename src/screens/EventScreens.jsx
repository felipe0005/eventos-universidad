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
import styles from "../styles/EventScreenStyle";

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
