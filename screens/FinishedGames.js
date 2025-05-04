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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FinishedGames = () => {
  const [historyGames, setHistoryGames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFinishedGames = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = parseInt(await AsyncStorage.getItem("userId")); // <-- fix burada

      const response = await axios.get(
        "https://wordbrust-server.onrender.com/api/game/finished-games",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bitmiş oyunlar:", response.data);

      if (response.data) {
        const formatted = response.data.map((g) => {
          const isUserPlayer1 = g.player1.id === userId;
          const me = isUserPlayer1 ? g.player1 : g.player2;
          const opponent = isUserPlayer1 ? g.player2 : g.player1;

          return {
            id: g.gameId,
            user_id: me.id,
            user_score: me.score,
            opponent_score: opponent.score,
            opponentUsername: opponent.username,
            updatedAt: g.updatedAt,
            winner_id: g.winnerId,
          };
        });

        console.log("Formatlanmış bitmiş oyunlar:", formatted);

        setHistoryGames(formatted);
      }
    } catch (err) {
      console.error(
        "Bitmiş oyunları alırken hata:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinishedGames();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFinishedGames();
  };

  const renderGameCard = ({ item }) => {
    const isWin =
      item.result?.toLowerCase().includes("kazandınız") ||
      item.winner_id === item.user_id;

    return (
      <TouchableOpacity style={styles.gameCard} activeOpacity={0.9}>
        <View style={styles.cardTopSection}>
          <Image
            source={require("../assets/images/profile-picture.png")}
            style={styles.avatar}
          />

          <View style={styles.gameInfo}>
            <Text style={styles.opponentName} numberOfLines={1}>
              {item.opponentUsername || "Bilinmiyor"}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {new Date(item.updatedAt).toLocaleDateString("tr-TR")}
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
                  {isWin ? "Kazandınız" : "Kaybettiniz"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>
            {item.user_score || 0} - {item.opponent_score || 0}
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={historyGames}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id.toString()}
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
      )}
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
