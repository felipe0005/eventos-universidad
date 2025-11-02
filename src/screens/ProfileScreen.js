import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          onPress: logout,
          style: "destructive",
        },
      ]
    );
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      admin: "Administrador",
      teacher: "Docente",
      student: "Estudiante",
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "#DC2626",
      teacher: "#2563EB",
      student: "#16A34A",
    };
    return colors[role] || "#6B7280";
  };

  const getRoleGradient = (role) => {
    const gradients = {
      admin: ["#DC2626", "#B91C1C"],
      teacher: ["#2563EB", "#1D4ED8"],
      student: ["#16A34A", "#15803D"],
    };
    return gradients[role] || ["#6B7280", "#4B5563"];
  };

  const menuItems = [
    {
      title: "Mis Eventos",
      subtitle: "Ver todos mis eventos",
      icon: "📅",
      onPress: () => navigation.navigate("Events"),
      show: true,
      color: "#3B82F6",
    },
    {
      title: "Crear Evento",
      subtitle: "Programar nuevo evento",
      icon: "➕",
      onPress: () => navigation.navigate("CreateEvent", { event: null }),
      show: user?.role === "admin" || user?.role === "teacher",
      color: "#10B981",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con información del usuario */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground} />
          <View style={styles.heroContent}>
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
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: getRoleColor(user?.role) },
                ]}
              >
                <Text style={styles.roleBadgeText}>
                  {getRoleDisplayName(user?.role)}
                </Text>
              </View>
            </View>

            <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "usuario@universidad.edu"}
            </Text>
          </View>
        </View>

        {/* Menú de opciones */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Opciones Principales</Text>
          <View style={styles.menuGrid}>
            {menuItems.map(
              (item, index) =>
                item.show && (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuCard}
                    onPress={item.onPress}
                  >
                    <View
                      style={[
                        styles.menuIconContainer,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                    {item.component || (
                      <View style={styles.menuArrowContainer}>
                        <Text style={styles.menuArrow}>›</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
            )}
          </View>
        </View>

        {/* Información de la app y logout */}
        <View style={styles.footerSection}>
          <View style={styles.appInfoCard}>
            <Text style={styles.appInfoTitle}>Eventos Universitarios</Text>
            <Text style={styles.appInfoDescription}>
              Conectando a la comunidad universitaria a través de eventos y
              actividades
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: "#1E40AF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1E40AF",
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  roleBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 24,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 8,
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  menuArrowContainer: {
    paddingLeft: 8,
  },
  menuArrow: {
    fontSize: 20,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  switchContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  footerSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  appInfoCard: {
    backgroundColor: "#EFF6FF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    alignItems: "center",
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 8,
    textAlign: "center",
  },
  appInfoDescription: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 12,
  },
});
