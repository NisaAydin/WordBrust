import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import socketService from "../services/SocketService";
import { GameService } from "../services/GameService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "https://wordbrust-server.onrender.com";

const NewGame = ({ navigation }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(null);

  const handleFindMatch = async (gameType) => {
    setIsMatching(true);
    setCurrentGameType(gameType);

    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const playerId = userData.id;
      console.log("Player ID:", playerId);

      // 1. Rakip bulma isteği (API)
      const result = await GameService.findOpponent(gameType);
      if (!result.success || !result.game?.id) {
        Alert.alert("Hata", "Eşleşme bulunamadı.");
        setIsMatching(false);
        return;
      }

      const gameId = result.game.id;

      // 2. Socket bağlantısı ve odaya katıl
      await socketService.connect(SERVER_URL);
      socketService.joinGameRoom(gameId); // sadece gameId yeterli

      // 3. Socket: iki oyuncu hazır olunca
      socketService.onBothPlayersReady(async () => {
        try {
          // 4. API: Gerekli verileri al
          const joinRes = await GameService.joinGame(gameId, playerId);
          const { board, letters, players, totalRemaining } = joinRes;

          setIsMatching(false);

          // 5. GameScreen'e yönlendir
          navigation.navigate("GameScreen", {
            gameId,
            board,
            letters,
            players,
            totalRemaining,
          });
        } catch (err) {
          console.error("Veri alma hatası:", err);
          Alert.alert("Hata", "Oyun verileri alınamadı.");
          setIsMatching(false);
        }
      });
    } catch (error) {
      console.error("Eşleşme hatası:", error);
      Alert.alert("Hata", "Eşleşme sırasında hata oluştu");
      setIsMatching(false);
    }
  };

  const gameModes = [
    {
      title: "Hızlı Oyunlar",
      description:
        "Hızlı düşün, hızlı hamle yap! Kısa sürede sonuç almak isteyenler için",
      modes: [
        {
          type: "2min",
          label: "2 Dakikalık",
          icon: "lightning-bolt",
          description: "Şimşek hızında bir mücadele",
        },
        {
          type: "5min",
          label: "5 Dakikalık",
          icon: "timer",
          description: "Stratejini daha rahat kur",
        },
      ],
    },
    {
      title: "Genişletilmiş Oyunlar",
      description:
        "Zekanı konuştur, hamlelerini özenle seç. Uzun vadeli strateji severler için",
      modes: [
        {
          type: "12h",
          label: "12 Saatlik",
          icon: "clock",
          description: "Her hamleye özen göster",
        },
        {
          type: "24h",
          label: "24 Saatlik",
          icon: "clock-outline",
          description: "Zamanın avantajını kullan",
        },
      ],
    },
  ];

  return (
    <LinearGradient
      colors={[Colors.background, Colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {gameModes.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>
                {section.description}
              </Text>
            </View>
            <View style={styles.modeContainer}>
              {section.modes.map((mode, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.modeCard}
                  onPress={() => handleFindMatch(mode.type)}
                  disabled={isMatching}
                  activeOpacity={0.8}
                >
                  <View style={styles.modeIconContainer}>
                    <MaterialCommunityIcons
                      name={mode.icon}
                      size={32}
                      color={Colors.textAccent}
                    />
                  </View>
                  <Text style={styles.modeLabel}>{mode.label}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {isMatching && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={Colors.textAccent} />
            <Text style={styles.loadingText}>
              <Text style={styles.highlightText}>{currentGameType}</Text> için
              eşleşme aranıyor...
            </Text>
            <Text style={styles.loadingHint}>
              Rakibin bulunana kadar bekleyin
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsMatching(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>VAZGEÇ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 35,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modeCard: {
    width: "48%",
    backgroundColor: Colors.statCardBackground,
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.statCardBorder,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modeIconContainer: {
    backgroundColor: "rgba(153, 102, 255, 0.25)",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryButtonBorder,
  },
  modeLabel: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modeDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 0, 51, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    backgroundColor: Colors.background,
    padding: 35,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: "85%",
    maxWidth: 350,
  },
  loadingText: {
    color: Colors.textPrimary,
    marginVertical: 20,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  highlightText: {
    fontWeight: "bold",
  },
  loadingHint: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 25,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: Colors.error,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FF6B8B",
  },
  cancelText: {
    color: Colors.textPrimary,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default NewGame;
