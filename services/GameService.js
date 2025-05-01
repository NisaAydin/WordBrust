// services/GameService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://wordbrust-server.onrender.com/api/game/find-or-create";

export const GameService = {
  async findOpponent(gameType) {
    try {
      // 1. Token kontrolü
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Oturum açılmamış");

      // 2. API isteği
      const response = await axios.post(
        API_URL,
        { game_mode: gameType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 3. KESİN BAŞARI KRİTERİ: game objesi ve id varsa
      if (response.data?.game?.id) {
        return {
          success: true,
          message: response.data.message || "Oyun başlatıldı",
          game: response.data.game,
          playerLetters: response.data.playerLetters || [],
          totalRemaining: response.data.totalRemaining || 0,
        };
      }

      // 4. Oyun oluşturuldu ama game objesi eksikse
      if (response.data.message?.toLowerCase().includes("oyun")) {
        console.warn("Eksik game objesi:", response.data);
        return {
          success: true,
          message: response.data.message,
          game: {
            game_mode: gameType,
            game_status: "pending",
            id: Date.now(), // Geçici ID
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

      // Özel durum: Error içinde başarı mesajı
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
};
