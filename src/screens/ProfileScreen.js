import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
      teacher: "Profesor",
      student: "Estudiante",
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "#FF3B30",
      teacher: "#007AFF",
      student: "#4CD964",
    };
    return colors[role] || "#8E8E93";
  };

  const menuItems = [
    {
      title: "Mis Eventos",
      icon: "📅",
      onPress: () => navigation.navigate("Events"),
      show: true,
    },
    {
      title: "Crear Evento",
      icon: "➕",
      onPress: () => navigation.navigate("CreateEvent", { event: null }),
      show: user?.role === "admin" || user?.role === "teacher",
    },
    {
      title: "Ayuda y Soporte",
      icon: "❓",
      onPress: () =>
        Alert.alert("Ayuda", "Contacta con soporte: soporte@escuela.com"),
      show: true,
    },
    {
      title: "Acerca de",
      icon: "ℹ️",
      onPress: () =>
        Alert.alert(
          "Acerca de",
          "Eventos Escolares v1.0\n\nAplicación desarrollada para la gestión de eventos escolares."
        ),
      show: true,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con información del usuario */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getRoleColor(user?.role) },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {getRoleDisplayName(user?.role)}
            </Text>
          </View>
        </View>

        <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
        <Text style={styles.userEmail}>
          {user?.email || "email@ejemplo.com"}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Asistencias</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Creados</Text>
          </View>
        </View>
      </View>

      {/* Menú de opciones */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Opciones</Text>
        {menuItems.map(
          (item, index) =>
            item.show && (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                disabled={!item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                {item.component || <Text style={styles.menuArrow}>›</Text>}
              </TouchableOpacity>
            )
        )}
      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versión 1.0.0</Text>
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
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  roleBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    height: "80%",
    alignSelf: "center",
  },
  menuSection: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    padding: 15,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  menuArrow: {
    fontSize: 20,
    color: "#999",
  },
  logoutSection: {
    padding: 20,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
});
