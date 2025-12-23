import React, { useState, useEffect, useCallback } from "react";

const Minesweeper = () => {
  // --- CONFIGURACIÓN DINÁMICA DEL TABLERO ---
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [minesCount, setMinesCount] = useState(10);

  // --- ESTADOS DE LA LÓGICA DE JUEGO ---
  const [board, setBoard] = useState([]); // Matriz principal
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [bestTime, setBestTime] = useState(null);

  // Colores clásicos para la interfaz numérica
  const numberColors = {
    1: "#0000FF",
    2: "#008000",
    3: "#FF0000",
    4: "#000080",
    5: "#800000",
    6: "#008080",
    7: "#000000",
    8: "#808080",
  };

  // Efecto para inicializar el tablero y cargar récords al cambiar dimensiones
  useEffect(() => {
    const saved = localStorage.getItem(`bestTime_${rows}x${cols}`);
    setBestTime(saved ? parseInt(saved) : null);
    initBoard();
  }, [rows, cols]);

  // --- 1. GENERACIÓN DEL TABLERO Y MINAS ---
  const initBoard = useCallback(() => {
    // Generamos la estructura de datos: un array de arrays de objetos
    let newBoard = Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborCount: 0,
          }))
      );

    // Algoritmo de posicionamiento aleatorio de minas
    let placed = 0;
    while (placed < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Cálculo de proximidad: sumamos minas en el vecindario de cada celda
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const nr = r + i,
                nc = c + j;
              if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                newBoard[nr][nc].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborCount = count;
        }
      }
    }
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setIsActive(false);
  }, [rows, cols, minesCount]);

  // Manejo del cronómetro con limpieza de efectos
  useEffect(() => {
    let interval = null;
    if (isActive && !gameOver && !win) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, gameOver, win]);

  // --- 2. LÓGICA DE INTERACCIÓN (REVEAL Y FLOOD FILL) ---
  const revealCell = (r, c) => {
    if (gameOver || win || board[r][c].isRevealed || board[r][c].isFlagged)
      return;
    if (!isActive) setIsActive(true);

    // Clonación profunda para asegurar inmutabilidad y forzar el re-renderizado
    let newBoard = JSON.parse(JSON.stringify(board));

    if (newBoard[r][c].isMine) {
      setGameOver(true);
      // Revelamos todas las minas al fallar
      newBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setBoard(newBoard);
      return;
    }

    // Algoritmo recursivo para expandir áreas vacías (Flood Fill)
    const floodFill = (row, col) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return;
      if (
        newBoard[row][col].isRevealed ||
        newBoard[row][col].isMine ||
        newBoard[row][col].isFlagged
      )
        return;

      newBoard[row][col].isRevealed = true;

      // Si la celda es un 0, exploramos recursivamente sus 8 vecinos
      if (newBoard[row][col].neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) floodFill(row + i, col + j);
        }
      }
    };

    floodFill(r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  // Manejo de banderas mediante click derecho (onContextMenu)
  const toggleFlag = (e, r, c) => {
    e.preventDefault(); // Bloqueamos el menú por defecto del navegador
    if (gameOver || win || board[r][c].isRevealed) return;

    // Clonamos el estado para actualizar solo la propiedad isFlagged
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;

    setBoard(newBoard);
  };

  // --- 3. SISTEMA DE VICTORIA Y PERSISTENCIA ---
  const checkWin = (grid) => {
    // La victoria ocurre cuando no quedan celdas "seguras" por revelar
    const hiddenNonMines = grid
      .flat()
      .filter((cell) => !cell.isMine && !cell.isRevealed).length;
    if (hiddenNonMines === 0) {
      setWin(true);
      const currentRecord = localStorage.getItem(`bestTime_${rows}x${cols}`);
      if (!currentRecord || timer < parseInt(currentRecord)) {
        localStorage.setItem(`bestTime_${rows}x${cols}`, timer);
        setBestTime(timer);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#2c3e50",
        padding: "20px",
        margin: "0px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "Segoe UI, sans-serif",
          backgroundColor: "#bdbdbd",
          border: "4px ridge #ffffff",
          padding: "30px",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Buscaminas</h1>

        <div
          style={{
            marginBottom: "20px",
            display: "inline-flex",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#bdbdbd",
            border: "4px ridge #ffffff",
          }}
        >
          <label>
            Nivel:
            <select
              value={rows}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setRows(v);
                setCols(v);
              }}
            >
              <option value="8">8x8</option>
              <option value="12">12x12</option>
              <option value="16">16x16</option>
            </select>
          </label>
          <label>
            Minas:
            <input
              type="number"
              value={minesCount}
              onChange={(e) => setMinesCount(parseInt(e.target.value))}
              style={{ width: "45px" }}
            />
          </label>
          <button onClick={initBoard} style={{ cursor: "pointer" }}>
            Reset
          </button>
        </div>

        <div
          style={{ margin: "10px 0", fontSize: "1.1rem", fontWeight: "600" }}
        >
          ⏱️ Tiempo: {timer}s | 🏆 Récord ({rows}x{cols}):{" "}
          {bestTime ? `${bestTime}s` : "---"}
        </div>

        {gameOver && (
          <h2 style={{ color: "#d9534f" }}>💥 ¡BOOM! Juego Terminado</h2>
        )}
        {win && (
          <h2 style={{ color: "#5cb85c" }}>🎉 ¡VICTORIA! Tiempo: {timer}s</h2>
        )}

        {/* Cuadrícula dinámica generada con CSS Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 32px)`,
            justifyContent: "center",
            gap: "1px",
            backgroundColor: "#bdbdbd",
            padding: "5px",
            margin: "0 auto",
            userSelect: "none",
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => revealCell(rIdx, cIdx)}
                onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: cell.isRevealed ? "#ddd" : "#7b7b7b",
                  border: cell.isRevealed
                    ? "1px solid #aaa"
                    : "3px outset #eee",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: cell.isRevealed
                    ? numberColors[cell.neighborCount]
                    : "black",
                }}
              >
                {cell.isRevealed
                  ? cell.isMine
                    ? "💣"
                    : cell.neighborCount > 0
                    ? cell.neighborCount
                    : ""
                  : cell.isFlagged
                  ? "🚩"
                  : ""}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
