import api from "./api"; // axios instance'ı import ettik

export const UserService = {
  async getProfile() {
    try {
      const response = await api.get("/api/user/profile"); // Profil bilgilerini çekiyoruz
      console.log("Profil Yanıtı:", response.data);
      return response.data;
    } catch (error) {
      console.error("Profil alma hatası:", error);
      throw error;
    }
  },
};
