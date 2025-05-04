import React from "react";
import { View, StyleSheet } from "react-native";

const Circle = ({ size, position, mode = "dark" }) => {
  let circleColor;

  switch (mode) {
    case "dark":
      circleColor = "rgba(61, 4, 94, 0.25)";
      break;
    case "light":
    default:
      circleColor = "rgba(213, 229, 239, 0.35)";
      break;
  }

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: circleColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    opacity: 1,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1,
  },
});

export default Circle;
