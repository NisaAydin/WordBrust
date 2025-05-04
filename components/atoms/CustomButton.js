import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";

const CustomButton = ({ title, onPress, size = "medium" }) => {
  const getButtonWidth = () => {
    switch (size) {
      case "small":
        return 160;
      case "medium":
        return 264;
      default:
        return 170;
    }
  };
  return (
    <TouchableOpacity
      style={[styles.button, { width: getButtonWidth() }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontFamily: "roboto",
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default CustomButton;
