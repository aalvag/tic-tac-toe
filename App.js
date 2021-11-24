import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import bg from "./assets/bg.jpeg";

export default function App() {
  const [map, setMap] = React.useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [currentTurn, setCurrentTurn] = React.useState("x");

  const onPress = (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Invalid Move");
      return;
    }
    setMap((prevMap) => {
      const newMap = [...prevMap];
      newMap[rowIndex][columnIndex] = currentTurn;
      return newMap;
    });
    setCurrentTurn(currentTurn === "x" ? "o" : "x");

    const winner = getWinner();
    if (winner) {
      gameWon(winner);
    }
  };

  const getWinner = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = map[i].every((cell) => cell === "x");
      const isRowOWinning = map[i].every((cell) => cell === "o");
      if (isRowXWinning) {
        return "x";
      }
      if (isRowOWinning) {
        return "o";
      }
    }
    // check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;
      for (let row = 0; row < 3; row++) {
        if (map[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (map[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }
      if (isColumnXWinner) {
        return "x";
      }
      if (isColumnOWinner) {
        return "o";
      }
    }
    // check diagonals
    let isDiagonalXWinner = true;
    let isDiagonalOWinner = true;
    let isReverseDiagonalXWinner = true;
    let isReverseDiagonalOWinner = true;

    for (let i = 0; i < 3; i++) {
      if (map[i][i] !== "x") {
        isDiagonalXWinner = false;
      }
      if (map[i][i] !== "o") {
        isDiagonalOWinner = false;
      }
      if (map[2 - i][i] !== "x") {
        isReverseDiagonalXWinner = false;
      }
      if (map[2 - i][i] !== "o") {
        isReverseDiagonalOWinner = false;
      }
    }
    if (isDiagonalXWinner) {
      return "x";
    }
    if (isDiagonalOWinner) {
      return "o";
    }
    if (isReverseDiagonalXWinner) {
      return "x";
    }
    if (isReverseDiagonalOWinner) {
      return "o";
    }
    // check draw
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (map[i][j] === "") {
          isDraw = false;
        }
      }
    }
    if (isDraw) {
      Alert.alert("Draw", "Game is a draw", [
        {
          text: "Play Again",
          onPress: resetGame,
        },
      ]);
      return;
    }
  };

  const gameWon = (player) => {
    Alert.alert("Game Won", `player ${player.toUpperCase()} won`, [
      {
        text: "Play Again",
        onPress: resetGame,
      },
    ]);
  };

  //reset game
  const resetGame = () => {
    setMap([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentTurn("x");
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text style={styles.title}>Tic Tac Toe</Text>
        <Text style={styles.subtitle}>
          {currentTurn === "x" ? "X's Turn" : "O's Turn"}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Pressable
                  key={`cell-${columnIndex}`}
                  onPress={() => onPress(rowIndex, columnIndex)}
                  style={styles.cell}
                >
                  {cell === "o" && <View style={styles.circle} />}
                  {cell === "x" && (
                    <View style={styles.cross}>
                      <View style={styles.crossLine} />
                      <View
                        style={[styles.crossLine, styles.crossLineReversed]}
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ImageBackground>

      <StatusBar style="auto" />
    </View>
  );
}

//  <View style={styles.circle} />
//           <View style={styles.cross}>
//             <View style={styles.crossLine} />
//             <View style={[styles.crossLine, styles.crossLineReversed]} />
//           </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242D34",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingTop: 20,
  },
  cell: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  circle: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: "#fff",
    margin: 10,
  },
  cross: {
    flex: 1,
  },
  crossLine: {
    width: 10,
    height: "100%",
    left: "50%",
    backgroundColor: "#fff",
    position: "absolute",
    borderRadius: 5,
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },
  crossLineReversed: {
    transform: [{ rotate: "-45deg" }],
  },
  map: {
    width: "80%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    top: 50,
    position: "absolute",
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    position: "absolute",
    top: 90,
  },
});
