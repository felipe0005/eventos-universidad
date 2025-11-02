//imports necesarios para la funcionalidad de el manejo de pantallas
import React from "react";
import { View, Text } from "react-native";
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
        headerShown: false,
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
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: "Registro de Estudiante",
                headerBackTitle: "Login", // Para iOS
              }}
            />
          </>
        ) : (
          <>
            {/* Pantalla principal con tabs */}
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{
                headerShown: false,
              }}
            />

            {/* Pantallas modales */}
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{
                title: "Detalles del Evento",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={EventCreateScreen}
              options={{
                title: "Crear Evento",
                presentation: "modal",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
