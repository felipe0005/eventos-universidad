//imports necesarios para la funcionalidad de el manejo de pantallas
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";

// Importar pantallas de screens
import LoginScreen from "../screens/LoginScreens";
import RegisterScreen from "../screens/RegisterScreen";
import EventsScreen from "../screens/EventScreens";
import EventDetailsScreen from "../screens/EventDetailScreen";
import EventCreateScreen from "../screens/EventCreateScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para las pantallas principales
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="EventsTab"
        component={EventsScreen}
        options={{
          title: "Eventos",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📅</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // 🔥 PANTALLAS PARA USUARIOS NO AUTENTICADOS
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
                // Opcional: agregar botón de registro en header
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                    style={{ marginRight: 15 }}
                  >
                    <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                      Registrarse
                    </Text>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: "Registro de Estudiante",
                headerBackTitle: "Volver",
              }}
            />
          </>
        ) : (
          // Pantallas para usuarios autenticados
          <>
            <Stack.Screen
              name="Events"
              component={EventsScreen}
              options={{
                title: "Eventos Escolares",
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Mi Perfil" }}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{ title: "Detalles del Evento" }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={EventCreateScreen}
              options={{ title: "Crear Evento" }}
            />
            <Stack.Screen
              name="SavedEvents"
              component={SavedEventsScreen}
              options={{ title: "Mis Eventos Guardados" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
