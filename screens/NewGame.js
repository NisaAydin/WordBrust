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
import GameScreen from "./GameScreen";

const NewGame = ({ navigation }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(null);

  // Ekranda butona basıldığında
  const handleFindMatch = async (gameType) => {
    try {
      const result = await GameService.findOpponent(gameType);

      // BAŞARILI DURUM
      Alert.alert("Başarılı", result.message, [
        {
          text: "Tamam",
        },
      ]);
    } catch (error) {
      // HATA DURUMU
      Alert.alert("Hata", error.message, [{ text: "Tamam" }]);
    }
  };
  return (
    <View style={styles.container}>
      {/* Ana içerik */}
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

      {/* Loading overlay */}
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
