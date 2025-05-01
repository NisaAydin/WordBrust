import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../services/AuthContext";
import { Colors } from "../constants/Colors";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <LinearGradient
      colors={[Colors.background, "#2D0066", Colors.gradientEnd]}
      style={styles.container}
    >
      {/* Upper Info */}
      <View style={styles.header}>
        <Text style={styles.time}></Text>
        <View style={styles.profileIcon}>
          <Image
            source={
              user?.profileImage ||
              require("../assets/images/profile-picture.png")
            }
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>
          Merhaba,{" "}
          <Text style={styles.username}>{user?.username || "Oyuncu"}</Text>!
        </Text>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="medal"
              size={28}
              color={Colors.textAccent}
            />
            <Text style={styles.statText}>Seviye {user?.level || "1"}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="chart-line"
              size={28}
              color={Colors.success}
            />
            <Text style={styles.statText}>
              %{user?.successRate || "0"} Başarı
            </Text>
          </View>
        </View>

        {/* Main Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("NewGame")}
          >
            <MaterialCommunityIcons
              name="sword-cross"
              size={28}
              color={Colors.error}
            />
            <Text style={styles.buttonText}>Yeni Oyun</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("ActiveGames")}
          >
            <MaterialCommunityIcons
              name="clock"
              size={28}
              color={Colors.textPrimary}
            />
            <Text style={styles.buttonText}>Aktif Oyunlar</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Buttons */}
        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <MaterialCommunityIcons
              name="trophy"
              size={28}
              color={Colors.textAccent}
            />
            <Text style={styles.secondaryButtonText}>Sıralama</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("History")}
          >
            <MaterialCommunityIcons
              name="history"
              size={28}
              color={Colors.secondary}
            />
            <Text style={styles.secondaryButtonText}>Geçmiş</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  time: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.secondary,
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontFamily: "Roboto-Bold",
    marginBottom: 30,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: Colors.statCardBackground,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.statCardBorder,
    backdropFilter: "blur(10px)",
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    color: Colors.textPrimary,
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.buttonBorder,
    elevation: 5,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    marginLeft: 10,
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    backgroundColor: Colors.secondaryButtonBackground,
    padding: 15,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.secondaryButtonBorder,
    elevation: 4,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginLeft: 8,
  },
  username: {
    color: Colors.textAccent,
  },
});

export default HomeScreen;
