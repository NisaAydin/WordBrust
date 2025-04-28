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
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../services/AuthContext";
import { UserService } from "../services/UserService";
import { Colors } from "../constants/Colors"; // Ensure you have this color file for consistency
import Circle from "../components/atoms/Circle"; // Circle component for design

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
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
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthScreen" }],
      });
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Logout failed.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arka Plan Tasarımı */}
      <Circle size={250} position={{ left: -120, top: -100 }} mode="light" />
      <Circle size={250} position={{ left: -50, top: -80 }} mode="light" />

      {/* Profil Bilgileri */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profile?.profileImage ||
            require("../assets/images/profile-picture.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profile?.username || "Misafir"}</Text>
        <Text style={styles.infoText}>{profile?.email || "N/A"}</Text>
        <Text style={styles.infoText}>
          Wins: {profile?.user_win_count || 0}
        </Text>
        <Text style={styles.infoText}>
          Losses: {profile?.user_loss_count || 0}
        </Text>
      </View>

      {/* Çıkış Butonu */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
