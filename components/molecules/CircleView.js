import React from "react";
import Circle from "../atoms/Circle";
import { View, StyleSheet } from "react-native";

const CircleView = () => {
  return (
    <View style={styles.container}>
      <Circle size={200} position={{ left: -20, top: -100 }} />
      <Circle size={200} position={{ left: -100, top: -10 }} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CircleView;
