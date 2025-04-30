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
import { Colors } from "../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import socketService from "../services/SocketService"; // socket ekledik

const API_URL = "https://wordbrust-server.onrender.com/api"; // <- kendi API adresinle değiştir

const ActiveGames = () => {
  const [activeGames, setActiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
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
      }
    };

    fetchActiveGames();
  }, []);

  const handleGamePress = async (gameId) => {
    try {
      // Eğer socket bağlı değilse bağlan
      if (!socketService.socket || !socketService.socket.connected) {
        await socketService.connect("https://wordbrust-server.onrender.com"); // kendi URL’inle değiştir
      }

      socketService.joinGameRoomAndListenBoard(gameId, (board) => {
        navigation.navigate("GameScreen", {
          gameId,
          board,
          playerLetters: null,
        });
      });
    } catch (error) {
      console.error("Oyuna katılırken hata:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => handleGamePress(item.gameId)}
    >
      <View style={styles.cardContent}>
        <Image
          source={require("../assets/images/profile-picture.png")}
          style={styles.avatar}
        />
        <View style={styles.gameInfo}>
          <Text style={styles.userName}>{item.opponentUsername}</Text>
          <Text style={styles.gameDetails}>
            {item.scoreText} - {item.durationText}
          </Text>
          <Text style={styles.status}>{item.turnInfo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activeGames}
        renderItem={renderItem}
        keyExtractor={(item) => item.gameId.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  gameCard: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  gameInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  gameDetails: {
    color: "white",
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
  },
  status: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ActiveGames;
