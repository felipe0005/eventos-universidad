import API from "./api";

export const eventsService = {
  // Obtener todos los eventos
  getEvents: async () => {
    try {
      console.log("📡 Obteniendo eventos...");
      const response = await API.get("/events");
      console.log("✅ Eventos obtenidos:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error obteniendo eventos:", error);
      throw error.response?.data || { message: "Error al obtener eventos" };
    }
  },

  // Obtener un evento específico
  getEventById: async (id) => {
    try {
      console.log("📡 Obteniendo evento:", id);
      const response = await API.get(`/events/${id}`);
      console.log("✅ Evento obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error obteniendo evento:", error);
      throw error.response?.data || { message: "Error al obtener evento" };
    }
  },

  // Crear nuevo evento
  createEvent: async (eventData) => {
    try {
      console.log("📡 Creando evento:", eventData);
      const response = await API.post("/events", eventData);
      console.log("✅ Evento creado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error creando evento:", error);
      throw error.response?.data || { message: "Error al crear evento" };
    }
  },

  // Actualizar evento
  updateEvent: async (id, eventData) => {
    try {
      console.log("📡 Actualizando evento:", id, eventData);
      const response = await API.put(`/events/${id}`, eventData);
      console.log("✅ Evento actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error actualizando evento:", error);
      throw error.response?.data || { message: "Error al actualizar evento" };
    }
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    try {
      console.log("📡 Eliminando evento:", id);
      const response = await API.delete(`/events/${id}`);
      console.log("✅ Evento eliminado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error eliminando evento:", error);
      throw error.response?.data || { message: "Error al eliminar evento" };
    }
  },
};
