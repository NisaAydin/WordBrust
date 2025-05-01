import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

const CardComponent = ({ isOpposite = false, children }) => {
  return (
    <View
      style={[
        styles.card,
        isOpposite ? styles.oppositeCard : styles.normalCard,
      ]}
    >
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    justifyContent: "flex-start", // İçeriği üstten hizala
  },
  contentContainer: {
    width: "100%",
    padding: 20,
    flex: 1, // Tüm alanı kapla
  },
  normalCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 40, // Üst padding'i artır
    minHeight: 375, // Sabit yükseklik yerine minimum yükseklik
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  oppositeCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 40, // Alt padding'i artır
    minHeight: 300,
    backgroundColor: "transparent",
  },
});

export default CardComponent;
