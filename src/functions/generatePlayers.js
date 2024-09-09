import boardgame from "../boardmage/boardgame.js";

const generatePlayers = (newTablero) => {
  let playerPosition = null;

  Object.keys(boardgame.players).forEach((playerKey) => {
    const player = boardgame.players[playerKey];

    if (player.quantity === 1) {
      while (playerPosition === null) {
        let x = Math.floor(Math.random() * newTablero.length);
        let y = Math.floor(Math.random() * newTablero[0].length);

        if (newTablero[x][y] === 0) {
          newTablero[x][y] = player.symbol;
          playerPosition = { row: x, col: y };
        }
      }
    }
  });

  return { newTablero, playerPosition };
};

export default generatePlayers;
