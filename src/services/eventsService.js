import API from "./api";

export const eventsService = {
  getEvents: async () => {
    try {
      const response = await API.get("/events");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener eventos" };
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await API.post("/events", eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al crear evento" };
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await API.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al actualizar evento" };
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await API.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al eliminar evento" };
    }
  },

  getEventById: async (id) => {
    try {
      const response = await API.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener evento" };
    }
  },
};
