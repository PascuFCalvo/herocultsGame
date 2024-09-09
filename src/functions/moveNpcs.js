const moveNpcs = (tablero) => {
  let newTablero = tablero.map((row) =>
    row.map((cell) => (typeof cell === "object" ? { ...cell } : cell))
  );
  let enemigos = ["o", "s"];

  // Encuentra la posición actual de los enemigos
  let enemigosPos = [];
  for (let i = 0; i < newTablero.length; i++) {
    for (let j = 0; j < newTablero[i].length; j++) {
      if (
        typeof newTablero[i][j] === "object" &&
        enemigos.includes(newTablero[i][j].symbol)
      ) {
        enemigosPos.push({ ...newTablero[i][j], x: i, y: j });
      }
    }
  }

  // Mueve aleatoriamente cada enemigo
  enemigosPos.forEach((enemigo) => {
    let dx = Math.floor(Math.random() * 3) - 1;
    let dy = Math.floor(Math.random() * 3) - 1;
    let newX = enemigo.x + dx;
    let newY = enemigo.y + dy;

    if (
      newX >= 0 &&
      newX < newTablero.length &&
      newY >= 0 &&
      newY < newTablero[0].length &&
      newTablero[newX][newY] === 0
    ) {
      // Mueve el enemigo
      newTablero[enemigo.x][enemigo.y] = 0;
      newTablero[newX][newY] = { symbol: enemigo.symbol, id: enemigo.id }; // Mantiene la ID
    }
  });

  return newTablero;
};

export default moveNpcs;
