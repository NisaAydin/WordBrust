import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../services/AuthContext";
import { UserService } from "../services/UserService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getProfile();
        setProfile(data);
      } catch (error) {
        console.log("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully.");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Logout failed.");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[Colors.background, Colors.gradientEnd]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={Colors.textAccent} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.background, Colors.gradientEnd]}
      style={styles.container}
    >
      {/* Profil Bilgileri */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              profile?.profileImage ||
              require("../assets/images/profile-picture.png")
            }
            style={styles.profileImage}
          />
          <View style={styles.levelBadge}>
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={Colors.textAccent}
            />
            <Text style={styles.levelText}>Seviye {profile?.level || 1}</Text>
          </View>
        </View>

        <Text style={styles.username}>{profile?.username || "Misafir"}</Text>
        <Text style={styles.infoText}>
          {profile?.email || "misafir@mail.com"}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="trophy"
              size={24}
              color={Colors.textAccent}
            />
            <Text style={styles.statText}>{profile?.user_win_count || 0}</Text>
            <Text style={styles.statLabel}>Galibiyet</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="shield-remove"
              size={24}
              color={Colors.error}
            />
            <Text style={styles.statText}>{profile?.user_loss_count || 0}</Text>
            <Text style={styles.statLabel}>Mağlubiyet</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={Colors.success}
            />
            <Text style={styles.statText}>
              {profile?.successRate ? `${profile.successRate}%` : "0%"}
            </Text>
            <Text style={styles.statLabel}>Başarı</Text>
          </View>
        </View>
      </View>

      {/* Çıkış Butonu */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons
          name="logout-variant"
          size={20}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: "100%",
    backgroundColor: Colors.statCardBackground,
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.statCardBorder,
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: 10,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.buttonBorder,
  },
  levelText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    marginLeft: 4,
  },
  username: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: Colors.textSecondary,
    marginVertical: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: Colors.textPrimary,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: Colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF6B8B",
    width: "90%", // Genişlik artırıldı
    alignSelf: "center", // Ortalamak için
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});

export default Profile;
