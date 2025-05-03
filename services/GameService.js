import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://wordbrust-server.onrender.com/api";

export const GameService = {
  /**
   * Rakip bulma veya var olan oyunu döndürme
   * @param {string} gameType
   */
  async findOpponent(gameType) {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Oturum açılmamış");

      const response = await axios.post(
        `${BASE_URL}/game/find-or-create`,
        { game_mode: gameType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.game?.id) {
        return {
          success: true,
          message: response.data.message || "Oyun başlatıldı",
          game: response.data.game,
        };
      }

      if (response.data.message?.toLowerCase().includes("oyun")) {
        return {
          success: true,
          message: response.data.message,
          game: {
            game_mode: gameType,
            game_status: "pending",
            id: Date.now(),
          },
        };
      }

      throw new Error(response.data.message || "Geçersiz yanıt");
    } catch (error) {
      console.error("API Hatası:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response?.data?.message?.toLowerCase().includes("oyun")) {
        return {
          success: true,
          message: error.response.data.message,
          game: error.response.data.game || { game_mode: gameType },
        };
      }

      throw new Error(error.response?.data?.message || error.message);
    }
  },

  /**
   * Oyuna katılan oyuncu için board, harf, oyuncu bilgisi ve kalan harfleri alır
   * @param {number|string} gameId
   * @param {number|string} playerId
   * @param {string} token
   * @returns {Promise<{board: [], letters: [], players: [], totalRemaining: number}>}
   */
  async joinGame(gameId, playerId) {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("Oturum açılmamış");
    try {
      const response = await axios.post(
        `${BASE_URL}/game/${gameId}/join`,
        { playerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("GameService.joinGame hata:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
