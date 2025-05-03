import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://wordbrust-server.onrender.com/api";

export const MoveService = {
  async sendMove(gameId, moveData) {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("Oturum açılmamış");

    try {
      const response = await axios.post(
        `${BASE_URL}/move/${gameId}/move`,
        moveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Hamle gönderme hatası:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
