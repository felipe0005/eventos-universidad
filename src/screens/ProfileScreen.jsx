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
import { styles } from "../styles/ProfileScreenStyle";

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
