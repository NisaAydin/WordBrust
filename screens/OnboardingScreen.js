import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors } from "../constants/Colors";
import CustomButton from "../components/atoms/CustomButton";
import Circle from "../components/atoms/Circle";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage'ı import ettik

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  const handlePress = async (index) => {
    console.log("Butona basıldı, Sayfa: ", index);

    if (index === 0) {
      setCurrentPage((prevPage) => prevPage + 1);
      flatListRef.current.scrollToIndex({ index: currentPage + 1 });
    } else if (index === 1) {
      await AsyncStorage.setItem("isFirstLaunch", "false");
      navigation.navigate("AuthScreen");
    }
  };

  const pages = [
    {
      id: "1",
      image: require("../assets/images/logo.png"),
      title: "WordBrust'e Hoşgeldiniz",
      description:
        "Dinamik bir kelime oyunu dünyasına adım atıyorsunuz. Kelimelerle dolu bu heyecan verici dünyada rakiplerinize karşı stratejik hamleler yaparak kazanın ve mayınlardan kaçının!",
      buttonText: "Atla",
    },
    {
      id: "2",
      image: require("../assets/images/rocket-image.png"),
      title: "Kelimeleri Yerleştir, Mayınlardan Kaçın!",
      description:
        "Kelimelerle yarışırken dikkatli olun! Rakibinizle yarışarak en fazla puanı kazanmaya çalışın. Fakat dikkat! Mayınlar her an karşınıza çıkabilir.",
      buttonText: "Hemen Başla",
    },
  ];

  const renderPageIndicator = (index) => {
    return (
      <View style={styles.indicatorContainer}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[styles.indicator, i === index && styles.activeIndicator]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Circles */}
      <Circle size={200} position={{ left: -20, top: -100 }} />
      <Circle size={200} position={{ left: -100, top: -10 }} />

      {/* FlatList with pages */}
      <FlatList
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.pageContainer}>
            <Image source={item.image} style={styles.image} />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.buttonContainer}>
              {renderPageIndicator(index)}
              <CustomButton
                title={item.buttonText}
                size="small"
                onPress={() => handlePress(index)}
              />
            </View>
          </View>
        )}
        ref={flatListRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  pageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.1,
    paddingBottom: height * 0.1,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginHorizontal: width * 0.1,
  },
  description: {
    fontSize: 13,
    padding: 20,
    textAlign: "center",
    fontFamily: "roboto",
    lineHeight: 20,
    marginHorizontal: width * 0.1,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.02,
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 5,
    margin: 5,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
    width: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    bottom: height * 0.1,
    width: "80%",
    alignItems: "center",
  },
});

export default OnboardingScreen;
