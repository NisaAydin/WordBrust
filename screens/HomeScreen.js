import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import CardComponent from "../components/atoms/CardComponent";
import Circle from "../components/atoms/Circle"; // Circle component'ini import ettik
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const { user: kullanıcı } = useAuth(); // AuthContext'ten kullanıcı bilgisi
  const navigation = useNavigation();

  const goToNewGame = () => {
    console.log("new game button tapped.");
    navigation.navigate("NewGame");
  };

  const goToActiveGames = () => {
    navigation.navigate("ActiveGames");
  };

  return (
    <View style={styles.container}>
      <Circle size={200} position={{ left: -20, top: -100 }} mode="light" />
      <Circle size={200} position={{ left: -100, top: -30 }} mode="light" />

      <View style={styles.cardContainer}>
        <CardComponent />
        <View style={styles.profileSection}>
          {/* Kullanıcı resmini context'ten al */}
          <Image
            source={
              kullanıcı?.profileImage ||
              require("../assets/images/profile-picture.png")
            }
            style={styles.profileImage}
          />
          {/* Kullanıcı adını context'ten al */}
          <Text style={styles.welcomeText}>
            Hoşgeldiniz {kullanıcı?.username || "Misafir"}
          </Text>
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Başarı Yüzdesi %{kullanıcı?.successRate || "0"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.button} onPress={goToNewGame}>
            <Text style={styles.buttonText}>Yeni Oyun</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToActiveGames}>
            <Text style={styles.buttonText}>Aktif Oyunlar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonAlt}>
          <Text style={styles.buttonText}>Biten Oyunlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "roboto",
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileSection: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -50 }],
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  successContainer: {
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  successText: {
    fontSize: 16,
    color: "color",
  },
  buttonContainer: {
    flexDirection: "center", // Column yönünde hizalama yapılacak
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 50, // Space between profile section and buttons
  },
  rowButtons: {
    flexDirection: "row", // İlk iki butonu yatayda yerleştir
    justifyContent: "space-between", // Aralarındaki boşluğu eşit dağıt
    marginBottom: 20, // Butonlar arasında boşluk
  },
  buttonAlt: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    borderColor: "black",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    borderColor: "black",
    borderWidth: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
