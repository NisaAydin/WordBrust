import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserService } from "../services/UserService";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../services/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { logout } = useAuth(); // logout fonksiyonunu burada alıyoruz

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getProfile();
        setProfile(data);
      } catch (error) {
        console.log("Hata:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // AuthContext'teki logout fonksiyonunu kullanıyoruz
      Alert.alert("Başarılı", "Çıkış yapıldı");

      // Çıkış yaptıktan sonra kullanıcıyı AuthScreen'e yönlendiriyoruz
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthScreen" }],
      });
    } catch (error) {
      console.log("Çıkış hatası:", error);
      Alert.alert("Hata", "Çıkış yapılamadı");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profil Bilgileri */}
      {profile ? (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Kullanıcı Adı:</Text>
          <Text style={styles.value}>{profile.username}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>Kazanma:</Text>
          <Text style={styles.value}>{profile.user_win_count}</Text>

          <Text style={styles.label}>Kayıp:</Text>
          <Text style={styles.value}>{profile.user_loss_count}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Profil bilgisi yüklenemedi</Text>
      )}

      {/* Çıkış Butonu */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>ÇIKIŞ YAP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
