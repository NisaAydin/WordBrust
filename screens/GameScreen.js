import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";

import { Colors } from "../constants/Colors";
import CardComponent from "../components/atoms/CardComponent";
import socketService from "../services/SocketService";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameService } from "../services/GameService";
import { MoveService } from "../services/MoveService"; // dosyanın en üstüne ekle

const SERVER_URL = "https://wordbrust-server.onrender.com";
const CELL_SIZE = Dimensions.get("window").width / 15 - 3;
const LETTER_SIZE = Dimensions.get("window").width / 10 - 4;
const BOARD_SIZE = 15;

const GameScreen = ({ route }) => {
  const { gameId } = route.params;

  const getLetterPoints = (letter) => {
    const pointsMap = {
      A: 1,
      B: 3,
      C: 4,
      Ç: 4,
      D: 3,
      E: 1,
      F: 7,
      G: 5,
      Ğ: 8,
      H: 5,
      I: 2,
      İ: 1,
      J: 10,
      K: 1,
      L: 1,
      M: 2,
      N: 1,
      O: 1,
      Ö: 7,
      P: 5,
      R: 1,
      S: 2,
      Ş: 4,
      T: 1,
      U: 2,
      Ü: 3,
      V: 7,
      Y: 3,
      Z: 4,
      "*": 0,
    };
    return pointsMap[letter] || 0;
  };

  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [letters, setLetters] = useState([]);
  const [players, setPlayers] = useState([]);
  const [remainingLetters, setRemainingLetters] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);

  const sortBoard = (board) => {
    return board.sort((a, b) => {
      if (a.row === b.row) {
        return a.col - b.col;
      }
      return a.row - b.row;
    });
  };

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => setCurrentUserId(parseInt(id)));
  }, []);

  useEffect(() => {
    if (currentUserId == null) return;

    let mounted = true;

    const fetchGameState = async () => {
      const response = await GameService.joinGame(gameId);
      if (!mounted) return;

      setBoard(sortBoard(response.board));
      setRemainingLetters(response.totalRemaining);
      setPlayers(response.players);
      setLetters(
        response.letters.map((l, index) => ({
          id: `${l.letter}_${index}_${Date.now()}`, // benzersiz ID
          letter: l.letter,
          score: getLetterPoints(l.letter),
        }))
      );
      setIsMyTurn(response.isMyTurn);
    };

    (async () => {
      await socketService.connect(SERVER_URL);
      socketService.joinGameRoom(gameId, currentUserId);

      // 🎯 İlk veri çekimi
      await fetchGameState();

      // 🎯 Hamle yapıldığında güncelle
      socketService.onMoveMade(() => {
        console.log("📥 move_made alındı. Veriler güncelleniyor...");
        fetchGameState();
      });
    })();

    return () => {
      mounted = false;
      socketService.leaveGameRoom(gameId);
      socketService.offMoveMade(); // dinlemeyi bırak
    };
  }, [gameId, currentUserId]);

  const createGrid = (board) => {
    const grid = [];
    let row = [];
    for (let i = 0; i < board.length; i++) {
      row.push(board[i]);
      if (row.length === BOARD_SIZE) {
        grid.push(row);
        row = [];
      }
    }
    if (row.length > 0 && row.length < BOARD_SIZE) {
      const remainingCells = BOARD_SIZE - row.length;
      for (let i = 0; i < remainingCells; i++) {
        row.push({
          row: grid.length,
          col: row.length + i,
          letter: null,
          letter_multiplier: 1,
          word_multiplier: 1,
          bonus_type: null,
        });
      }
      grid.push(row);
    }
    return grid;
  };
  const handlePlayMove = async () => {
    try {
      const placedLetters = board.filter(
        (cell) => cell.letter && cell.initial === false
      );

      if (placedLetters.length === 0) {
        alert("En az 1 harf yerleştirmelisin");
        return;
      }

      const sameRow = placedLetters.every(
        (c) => c.row === placedLetters[0].row
      );
      const sameCol = placedLetters.every(
        (c) => c.col === placedLetters[0].col
      );

      if (!sameRow && !sameCol) {
        alert("Yeni harfler aynı satırda ya da sütunda olmalı");
        return;
      }

      const direction = sameRow ? "horizontal" : "vertical";
      const row = placedLetters[0].row;
      const col = placedLetters[0].col;

      const fullWordCells = board.filter((cell) => {
        if (direction === "horizontal" && cell.row === row && cell.letter)
          return true;
        if (direction === "vertical" && cell.col === col && cell.letter)
          return true;
        return false;
      });

      const sortedCells = fullWordCells.sort((a, b) =>
        direction === "horizontal" ? a.col - b.col : a.row - b.row
      );

      const word = sortedCells.map((c) => c.letter).join("");
      const score = placedLetters.reduce(
        (sum, l) => sum + getLetterPoints(l.letter),
        0
      );
      const startRow = sortedCells[0].row;
      const startCol = sortedCells[0].col;

      // 👉 Hamle API isteği
      const response = await MoveService.sendMove(gameId, {
        playerId: currentUserId,
        word,
        score,
        startRow,
        startCol,
        direction,
        usedLetters: placedLetters.map(({ row, col, letter }) => ({
          row,
          col,
          letter,
        })),
      });

      console.log("✅ Hamle sonucu:", response);

      // ⛔ Artık burada joinGame ile tekrar veri çekmeye gerek yok
      // Çünkü socketService.onMoveMade ile backend herkesi bilgilendiriyor

      // 🎯 Sadece kendi tarafını anlık olarak boşalt (isteğe bağlı)
      setSelectedLetter(null);
      setSelectedCell(null);
      setIsMyTurn(false);
    } catch (err) {
      let errorMessage = "Hamle gönderilemedi.";

      // sunucudan özel mesaj varsa al
      if (err.response?.data?.error) {
        errorMessage += "\n" + err.response.data.error;
      } else if (err.message) {
        errorMessage += "\n" + err.message;
      }

      alert(errorMessage); // sadece Alert göster
    }
  };

  const handleUndoMove = () => {
    const updatedBoard = board.map((cell) => {
      if (cell.initial === false) {
        return { ...cell, letter: null };
      }
      return cell;
    });

    const restoredLetters = board
      .filter((cell) => cell.initial === false && cell.letter)
      .map((cell, index) => ({
        id: `${cell.letter}_${index}_${Date.now()}`, // 🔄 benzersiz ID
        letter: cell.letter,
        score: getLetterPoints(cell.letter),
      }));

    setBoard(updatedBoard);
    setLetters([...letters, ...restoredLetters]);
    setSelectedCell(null);
    setSelectedLetter(null); // ✅ seçimi tamamen temizle
  };

  const handleCellPress = (cell) => {
    if (selectedLetter) {
      if (!cell.letter) {
        const newBoard = board.map((c) => {
          if (c.row === cell.row && c.col === cell.col) {
            return { ...c, letter: selectedLetter.letter, initial: false };
          }
          return c;
        });
        setBoard(newBoard);

        const index = letters.findIndex(
          (l) => l.letter === selectedLetter.letter
        );
        if (index !== -1) {
          const updatedLetters = [...letters];
          updatedLetters.splice(index, 1);
          setLetters(updatedLetters);
        }
        setSelectedLetter(null);
      }
    } else if (cell.letter) {
      setSelectedCell(cell);
    } else if (selectedCell) {
      const newBoard = board.map((c) => {
        if (c.row === selectedCell.row && c.col === selectedCell.col) {
          return { ...c, letter: null };
        }
        if (c.row === cell.row && c.col === cell.col) {
          return { ...c, letter: selectedCell.letter };
        }
        return c;
      });
      setBoard(newBoard);
      setSelectedCell(null);
    }
  };

  const handleLetterPress = (letterObj) => {
    setSelectedLetter(letterObj);
    setSelectedCell(null);
  };

  const renderCell = (cell) => {
    const isSelected =
      selectedCell?.row === cell.row && selectedCell?.col === cell.col;
    let cellStyle = [styles.cell];
    if (isSelected) cellStyle.push(styles.selectedCell);
    if (cell.word_multiplier === 3) cellStyle.push(styles.tripleWord);
    if (cell.word_multiplier === 2) cellStyle.push(styles.doubleWord);
    if (cell.letter_multiplier === 2) cellStyle.push(styles.doubleLetter);
    if (cell.letter_multiplier === 3) cellStyle.push(styles.tripleLetter);
    if (cell.bonus_type) cellStyle.push(styles.bonusCell);
    if (cell.mine_type) cellStyle.push(styles.mineCell);

    // 💡 Harf yerleştirildi ama henüz kaydedilmedi (Oyna'ya basılmadıysa)
    if (cell.letter && cell.initial === false) {
      cellStyle.push(styles.placedLetterCell);
    }

    return (
      <TouchableOpacity
        key={`${cell.row}-${cell.col}`}
        style={cellStyle}
        onPress={() => handleCellPress(cell)}
      >
        <Text style={styles.letter}>{cell.letter || ""}</Text>
        {!cell.letter && (
          <Text style={styles.multiplierText}>
            {cell.word_multiplier === 3
              ? "3xK"
              : cell.word_multiplier === 2
              ? "2xK"
              : cell.letter_multiplier === 2
              ? "2xH"
              : cell.letter_multiplier === 3
              ? "3xH"
              : ""}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderLetter = (letterObj, index) => {
    const isSelected = selectedLetter?.id === letterObj.id;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.letterTile, isSelected && styles.selectedLetterTile]}
        onPress={() => handleLetterPress(letterObj)}
      >
        <Text style={styles.letterTileText}>{letterObj.letter}</Text>
        <Text style={styles.letterTilePoints}>{letterObj.score}</Text>
      </TouchableOpacity>
    );
  };

  const gridData = createGrid(board);

  const me = players.find((p) => p.id === currentUserId) || {
    username: "",
    score: 0,
  };
  const opponent = players.find((p) => p.id !== currentUserId) || {
    username: "",
    score: 0,
  };

  return (
    <View style={styles.container}>
      <View style={styles.gameInfoContainer}>
        <View style={styles.playerInfoWrapper}>
          <View style={styles.playerBadge}>
            <Text style={styles.playerName} numberOfLines={1}>
              {me.username}
            </Text>
            <Text style={styles.playerScore}>{me.score}</Text>
          </View>
          <View
            style={[
              styles.turnIndicator,
              isMyTurn ? styles.activePlayer : null,
            ]}
          />
        </View>

        <View style={styles.centerInfo}>
          <View style={styles.remainingLettersBadge}>
            <Text style={styles.remainingLettersText}>{remainingLetters}</Text>
            <Text style={styles.remainingLettersLabel}>KALAN</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>02:45</Text>
          </View>
        </View>

        <View style={styles.playerInfoWrapper}>
          <View style={styles.playerBadge}>
            <Text style={styles.playerName} numberOfLines={1}>
              {opponent.username}
            </Text>
            <Text style={styles.playerScore}>{opponent.score}</Text>
          </View>
          <View
            style={[
              styles.turnIndicator,
              !isMyTurn ? styles.activePlayer : null,
            ]}
          />
        </View>
      </View>

      <View style={styles.board}>
        {gridData.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((cell) => renderCell(cell))}
          </View>
        ))}
      </View>

      {selectedCell && (
        <View style={styles.selectedInfo}>
          <Text>Seçili: {selectedCell.letter}</Text>
          <Text>
            Konum: ({selectedCell.row}, {selectedCell.col})
          </Text>
        </View>
      )}

      <CardComponent isOpposite={true}>
        <View style={styles.letterRackContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.letterRackScroll}
          >
            {letters.map((letter, index) => renderLetter(letter, index))}
          </ScrollView>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="pause" size={24} color={Colors.primary} />
            <Text style={styles.controlButtonText}>Pas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.playButton,
              !isMyTurn && { opacity: 0.4 }, // sırası değilse saydamlaştır
            ]}
            disabled={!isMyTurn} // sırası değilse tıklanamaz
            onPress={handlePlayMove}
            // onPress={handlePlayMove} // Oyna butonuna basınca yapılacak işlem
          >
            <Ionicons name="play" size={24} color="white" />
            <Text style={[styles.controlButtonText, { color: "white" }]}>
              Oyna
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleUndoMove}
          >
            <Ionicons name="arrow-undo" size={24} color={Colors.primary} />
            <Text style={styles.controlButtonText}>Geri Al</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="flag" size={24} color={Colors.primary} />
            <Text style={styles.controlButtonText}>Teslim</Text>
          </TouchableOpacity>
        </View>
      </CardComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,

    backgroundColor: Colors.background,
  },
  placedLetterCell: {
    backgroundColor: "#d1d5db", // açık gri ton
  },
  titleContainer: {
    marginHorizontal: 50,
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 2,
    borderRadius: 15,
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontFamily: "roboto",
    fontWeight: "bold",
    margin: 5,
    textAlign: "center",
    color: Colors.primary,
  },
  board: {
    flexDirection: "column",
    flexWrap: "wrap",
    backgroundColor: "#ecf0f1", // Colors.light da olabilir
    borderRadius: 4,
    padding: 2,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: "#34495e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderWidth: 0.5,
    borderColor: "#95a5a6",
    margin: 1,
    borderRadius: 5,
  },
  selectedCell: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
    borderWidth: 1.5,
  },
  letter: {
    fontSize: CELL_SIZE * 0.55,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  multiplierText: {
    fontSize: CELL_SIZE * 0.3,
    color: "black",
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  tripleWord: {
    backgroundColor: "#f39c12",
  },
  doubleWord: {
    backgroundColor: "#f1c40f",
  },
  doubleLetter: {
    backgroundColor: "#16a085",
  },
  tripleLetter: {
    backgroundColor: "#1abc9c",
  },
  bonusCell: {
    backgroundColor: "#9b59b6",
  },
  mineCell: {
    backgroundColor: "#9a8d7d",
  },
  selectedInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ecf0f1",
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  letterRackContainer: {
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: Colors.light, //
    borderColor: Colors.primary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  letterRackScroll: {
    paddingHorizontal: 5,
  },
  letterTile: {
    width: LETTER_SIZE,
    height: LETTER_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary, // f39c12 D4C9BE
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: "#34495e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  selectedLetterTile: {
    backgroundColor: "#f1c40f",
    transform: [{ scale: 1.1 }],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  letterTileText: {
    fontSize: LETTER_SIZE * 0.5,
    fontWeight: "bold",
    color: "#ffffff",
  },
  letterTilePoints: {
    position: "absolute",
    bottom: 4,
    right: 6,
    fontSize: LETTER_SIZE * 0.25,
    fontWeight: "bold",
    color: "#ffffff",
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    width: "23%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  controlButtonText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  gameInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.light,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    shadowColor: "#395C77",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  playerInfoWrapper: {
    flex: 1,
    alignItems: "center",
  },
  playerBadge: {
    backgroundColor: "rgba(57, 92, 119, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 80,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    maxWidth: 100,
  },
  playerScore: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 2,
  },
  turnIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(57, 92, 119, 0.1)",
    marginTop: 8,
  },
  activePlayer: {
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  centerInfo: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  remainingLettersBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 6,
  },
  remainingLettersText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  remainingLettersLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    marginTop: -3,
  },
  timerBadge: {
    backgroundColor: "rgba(47, 145, 151, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.secondary,
  },
});

export default GameScreen;
