import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

const CardComponent = () => {
  return <View style={styles.card}></View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 375,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10, // Space between text lines
  },
});

export default CardComponent;
