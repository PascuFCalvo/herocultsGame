const movePlayer = (dx, dy, tablero, setTablero, startCombat) => {
  let newTablero = tablero.map((row) => [...row]);
  let playerPosition = null;

  // Encuentra la posición actual del jugador
  newTablero.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "B") {
        playerPosition = { row: i, col: j };
      }
    });
  });

  if (playerPosition) {
    let newRow = playerPosition.row + dx;
    let newCol = playerPosition.col + dy;

    if (
      newRow >= 0 &&
      newRow < newTablero.length &&
      newCol >= 0 &&
      newCol < newTablero[0].length
    ) {
      const newCell = newTablero[newRow][newCol];

      if (newCell === 0 || newCell === "x") {
        // Mueve el jugador
        newTablero[playerPosition.row][playerPosition.col] = 0;
        newTablero[newRow][newCol] = "B";
        setTablero(newTablero);
        return { row: newRow, col: newCol };
      } else if (newCell === 2) {
        // Pregunta al usuario si quiere abrir la puerta
        if (window.confirm("Hay una puerta. ¿Quieres abrirla?")) {
          newTablero[playerPosition.row][playerPosition.col] = 0;
          newTablero[newRow][newCol] = "B";
          setTablero(newTablero);
          return { row: newRow, col: newCol };
        } else {
          return playerPosition; // No mover al jugador
        }
      } else if (
        typeof newCell === "object" &&
        ["o", "s"].includes(newCell.symbol)
      ) {
        console.log(`ID del enemigo detectado: ${newCell.id}`); // Depuración
        // Inicia el combate si hay un monstruo
        startCombat(newCell.id);
        return playerPosition; // No mover al jugador
      }
    } else {
      console.log("Movimiento fuera del tablero.");
    }
  } else {
    console.error("No se encontró la posición del jugador.");
  }

  return null;
};

export default movePlayer;
