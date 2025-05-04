import api from "./api";

export const UserService = {
  async getProfile() {
    try {
      const response = await api.get("/api/user/profile");
      console.log("Profil Yanıtı:", response.data);
      return response.data;
    } catch (error) {
      console.error("Profil alma hatası:", error);
      throw error;
    }
  },
};
