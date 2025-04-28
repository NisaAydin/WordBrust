import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/Colors";
import CustomButton from "../components/atoms/CustomButton";
import { GameService } from "../services/GameService";
import socketService from "../services/SocketService";

const SERVER_URL = "https://wordbrust-server.onrender.com";

const NewGame = ({ navigation }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(null);

  const handleFindMatch = async (gameType) => {
    try {
      setIsMatching(true);
      setCurrentGameType(gameType);

      const result = await GameService.findOpponent(gameType);

      if (result.success && result.game?.id) {
        const gameId = result.game.id;

        // 1. Socket bağlantısını aç
        await socketService.connect(SERVER_URL);

        // 2. Board eventini HEMEN dinle
        socketService.onBoardInitialized((boardData) => {
          console.log("📦 Gelen Board:", boardData);

          setIsMatching(false);

          // GameScreen'e yönlendir ve board bilgisini gönder
          navigation.navigate("GameScreen", {
            gameId: gameId,
            board: boardData,
          });
        });

        // 3. Sonra odaya katıl
        socketService.joinGameRoom(gameId);
      } else {
        Alert.alert("Hata", "Oyun başlatılamadı");
        setIsMatching(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", error.message || "Oyun aranırken hata oluştu");
      setIsMatching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.headerText}>Hızlı Oyunlar</Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="2 dakikalık"
              size="small"
              onPress={() => handleFindMatch("2min")}
              disabled={isMatching}
            />
            <CustomButton
              title="5 dakikalık"
              size="small"
              onPress={() => handleFindMatch("5min")}
              disabled={isMatching}
            />
          </View>
        </View>

        <Text style={styles.headerText}>Genişletilmiş Oyunlar</Text>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="12 saatlik"
            size="small"
            onPress={() => handleFindMatch("12h")}
            disabled={isMatching}
          />
          <CustomButton
            title="24 saatlik"
            size="small"
            onPress={() => handleFindMatch("24h")}
            disabled={isMatching}
          />
        </View>
      </View>

      {isMatching && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>
              {currentGameType} için eşleşme aranıyor...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsMatching(false)}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginVertical: 15,
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  cancelText: {
    color: "white",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
});

export default NewGame;
