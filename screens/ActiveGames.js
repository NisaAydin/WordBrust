import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons"; // Iconlar için Ionicons

const ActiveGames = () => {
  // Sahte oyun verisi
  const activeGamesData = [
    {
      id: "1",
      userName: "arokoth",
      gameTime: "9 - 25",
      duration: "47 dk.",
      status: "Oyun sırası sizde.",
    },
    {
      id: "2",
      userName: "jsmith",
      gameTime: "10 - 30",
      duration: "32 dk.",
      status: "Oyun sırası bekleniyor.",
    },
    {
      id: "3",
      userName: "mjones",
      gameTime: "2 - 15",
      duration: "5 dk.",
      status: "Oyun sırası sizde.",
    },
  ];

  // FlatList render item fonksiyonu
  const renderItem = ({ item }) => (
    <View style={styles.gameCard}>
      <View style={styles.cardContent}>
        <Image
          source={require("../assets/images/profile-picture.png")} // Sahte bir avatar
          style={styles.avatar}
        />
        <View style={styles.gameInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.gameDetails}>
            <Text style={styles.label}>Liste: </Text>
            {item.gameTime} - <Text style={styles.label}>Süre: </Text>
            {item.duration}
          </Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeGamesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
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
    overflow: "hidden", // Dışarı taşmaları engellemek için
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
  playButton: {
    backgroundColor: "#0056b3",
    padding: 10,
    borderRadius: 50,
  },
});

export default ActiveGames;
