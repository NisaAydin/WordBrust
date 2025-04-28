import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const GameScreen = ({ route }) => {
  const { gameId, board } = route.params; // navigation'dan gameId ve board geldi

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Oyun Başladı!</Text>
      <Text style={styles.subTitle}>Game ID: {gameId}</Text>

      <Text style={styles.subTitle}>
        Board Hücre Sayısı: {board?.length || 0}
      </Text>

      {/* Board'un ilk birkaç hücresini test için listeleyelim */}
      <FlatList
        data={board.slice(0, 10)} // sadece ilk 10 hücreyi gösterelim test için
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.cellText}>
            Row: {item.row}, Col: {item.col}, Letter: {item.letter || "-"}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  cellText: {
    fontSize: 14,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default GameScreen;
