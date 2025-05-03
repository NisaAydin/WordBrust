import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

// Örnek geçmiş oyun verileri
const mockHistoryData = [
  {
    gameId: "1",
    opponentUsername: "Ahmet",
    opponentImage: null,
    date: "12.05.2023",
    result: "Kazandınız",
    userScore: 15,
    opponentScore: 10,
    duration: "5 dakika",
  },
  {
    gameId: "2",
    opponentUsername: "Ayşe",
    opponentImage: null,
    date: "10.05.2023",
    result: "Kaybettiniz",
    userScore: 8,
    opponentScore: 12,
    duration: "2 dakika",
  },
  {
    gameId: "3",
    opponentUsername: "Mehmet",
    opponentImage: null,
    date: "08.05.2023",
    result: "Kazandınız",
    userScore: 20,
    opponentScore: 5,
    duration: "10 dakika",
  },
  {
    gameId: "4",
    opponentUsername: "Zeynep",
    opponentImage: null,
    date: "05.05.2023",
    result: "Kaybettiniz",
    userScore: 6,
    opponentScore: 18,
    duration: "7 dakika",
  },
  {
    gameId: "5",
    opponentUsername: "Can",
    opponentImage: null,
    date: "01.05.2023",
    result: "Kazandınız",
    userScore: 14,
    opponentScore: 14,
    duration: "12 dakika",
  },
];

const FinishedGames = () => {
  const [historyGames, setHistoryGames] = useState(mockHistoryData);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Yenileme fonksiyonu (simüle ediyoruz)
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleGamePress = (gameId) => {
    navigation.navigate("GameHistoryDetail", { gameId });
  };

  const renderGameCard = ({ item }) => {
    const isWin = item.result?.toLowerCase().includes("kazandınız") || false;

    return (
      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => handleGamePress(item.gameId)}
        activeOpacity={0.9}
      >
        <View style={styles.cardTopSection}>
          <Image
            source={require("../assets/images/profile-picture.png")}
            style={styles.avatar}
          />

          <View style={styles.gameInfo}>
            <Text style={styles.opponentName} numberOfLines={1}>
              {item.opponentUsername}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {item.date || "Tarih yok"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name={isWin ? "trophy" : "shield-remove"}
                  size={16}
                  color={isWin ? Colors.success : Colors.error}
                />
                <Text
                  style={[
                    styles.detailText,
                    isWin ? styles.winText : styles.loseText,
                  ]}
                >
                  {item.result || "Sonuç yok"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>
            {item.userScore || "0"} - {item.opponentScore || "0"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={Colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.gameCount}>
          {historyGames.length} {historyGames.length === 1 ? "oyun" : "oyun"}
        </Text>
      </View>

      <FlatList
        data={historyGames}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.gameId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="history"
              size={60}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>Geçmiş oyun bulunamadı</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </LinearGradient>
  );
};

// Stil tanımları (aktif oyunlar sayfasıyla aynı)
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
    paddingTop: 0,
    marginTop: 10,
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
  winText: {
    color: Colors.success,
  },
  loseText: {
    color: Colors.error,
  },
  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(153, 102, 255, 0.2)",
    marginTop: 8,
  },
  scoreText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
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
});

export default FinishedGames;
