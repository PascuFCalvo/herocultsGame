import boardgame from "../boardmage/boardgame.js";

// Genera enemigos en el tablero, cada uno con un ID único
const generateEnemies = (newTablero) => {
  Object.keys(boardgame.enemies).forEach((enemyKey) => {
    const enemy = boardgame.enemies[enemyKey];

    for (let i = 0; i < enemy.quantity; i++) {
      let enemyPosition = null;

      while (enemyPosition === null) {
        let x = Math.floor(Math.random() * newTablero.length);
        let y = Math.floor(Math.random() * newTablero[0].length);

        if (newTablero[x][y] === 0) {
          // Asignar un objeto que representa al enemigo con una ID única
          newTablero[x][y] = {
            symbol: enemy.symbol,
            id: Math.floor(Math.random() * 1000000), // ID única para cada enemigo
          };
          enemyPosition = { row: x, col: y };

          // Registrar la posición y detalles del enemigo
          console.log(
            `Enemigo de tipo ${enemy.symbol} generado en posición (${x}, ${y}) con ID ${newTablero[x][y].id}`
          );
        }
      }
    }
  });

  return newTablero;
};

export default generateEnemies;
