import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import socketService from "../services/SocketService";

const API_URL = "https://wordbrust-server.onrender.com/api";

const ActiveGames = () => {
  const [activeGames, setActiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchActiveGames = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/game/active-games`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveGames(response.data);
    } catch (error) {
      console.error("Aktif oyunlar alınamadı:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveGames();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActiveGames();
  };

  const handleGamePress = async (gameId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const playerId = userData.id;

      // 1. Socket bağlantısı yoksa bağlan
      if (!socketService.socket || !socketService.socket.connected) {
        await socketService.connect("https://wordbrust-server.onrender.com");
      }

      // 2. Socket ile odaya katıl
      socketService.joinGameRoom(gameId, playerId);

      // 3. API ile güncel verileri al
      const response = await axios.post(
        `${API_URL}/game/${gameId}/join`,
        { playerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { board, letters, players, totalRemaining } = response.data;

      // 4. GameScreen'e yönlendir
      navigation.navigate("GameScreen", {
        gameId,
        board,
        letters,
        players,
        totalRemaining,
      });
    } catch (error) {
      console.error("Oyuna katılırken hata:", error);
    }
  };

  const renderGameCard = ({ item }) => {
    const isYourTurn = item.turnInfo?.toLowerCase().includes("sizde") || false;
    const turnText = isYourTurn ? "SENİN SIRAN" : "RAKİBİN SIRASI";

    return (
      <TouchableOpacity
        style={[styles.gameCard, isYourTurn && styles.yourTurnCard]}
        onPress={() => handleGamePress(item.gameId)}
        activeOpacity={0.9}
      >
        <View style={styles.cardTopSection}>
          <Image
            source={
              item.opponentImage
                ? { uri: item.opponentImage }
                : require("../assets/images/profile-picture.png")
            }
            style={styles.avatar}
          />

          <View style={styles.gameInfo}>
            <Text style={styles.opponentName} numberOfLines={1}>
              {item.opponentUsername}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {item.durationText || "Süre yok"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="sword-cross"
                  size={16}
                  color={Colors.textAccent}
                />
                <Text style={styles.detailText}>
                  {item.scoreText || "0 - 0"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[styles.turnSection, isYourTurn && styles.yourTurnSection]}
        >
          <MaterialCommunityIcons
            name={isYourTurn ? "star-circle" : "clock-outline"}
            size={18}
            color={isYourTurn ? Colors.success : Colors.textAccent}
          />
          <Text style={styles.turnText}>{turnText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[Colors.background, Colors.gradientEnd]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={Colors.textAccent} />
        <Text style={styles.loadingText}>Aktif oyunlar yükleniyor...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.background, Colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.gameCount}>
          {activeGames.length} {activeGames.length === 1 ? "oyun" : "oyun"}
        </Text>
      </View>

      <FlatList
        data={activeGames}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.gameId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="gamepad-square"
              size={60}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>Aktif oyun bulunamadı</Text>
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={() => navigation.navigate("NewGame")}
            >
              <Text style={styles.newGameButtonText}>Yeni Oyun Başlat</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.textPrimary,
    marginTop: 15,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontFamily: "Roboto-Bold",
  },
  gameCount: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  gameCard: {
    backgroundColor: Colors.statCardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.statCardBorder,
  },
  yourTurnCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  cardTopSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
    marginRight: 10,
  },
  opponentName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Roboto-Medium",
    marginLeft: 5,
  },
  turnSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "rgba(102, 51, 153, 0.1)",
    borderRadius: 8,
    marginTop: 5,
  },
  yourTurnSection: {
    backgroundColor: "rgba(0, 255, 170, 0.15)",
  },
  turnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginTop: 15,
    textAlign: "center",
  },
  newGameButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 25,
    borderWidth: 1,
    borderColor: Colors.buttonBorder,
  },
  newGameButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});

export default ActiveGames;
