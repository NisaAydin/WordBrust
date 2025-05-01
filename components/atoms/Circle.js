// components/atoms/Circle.js
import React from "react";
import { View, StyleSheet } from "react-native";

const Circle = ({ size, position, mode = "dark" }) => {
  // Renk değişimi için switch case kullanıyoruz
  let circleColor;

  switch (mode) {
    case "dark":
      circleColor = "rgba(61, 4, 94, 0.25)"; // Dark mode color
      break;
    case "light":
    default:
      circleColor = "rgba(213, 229, 239, 0.35)"; // Light mode color
      break;
  }

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2, // Yuvarlak daire yapar
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: circleColor, // Renk burada dinamik olarak ayarlanıyor
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    opacity: 1,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 }, // Gölgenin pozisyonu
    shadowOpacity: 0.1, // Gölgenin opaklığı
    shadowRadius: 10, // Gölgenin yayılma genişliği
    zIndex: 1,
  },
});

export default Circle;
