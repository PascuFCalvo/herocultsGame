import { useState, useEffect } from "react";
import "./boardgame.css";
import boardgame from "./boardgame.js";
import movePlayer from "../functions/movePlayer.js";
import generateEnemies from "../functions/generateEnemies.js";
import generatePlayers from "../functions/generatePlayers.js";
import moveNpcs from "../functions/moveNpcs.js";
import CombatCard from "../combat/combatCard.jsx";

const BoardGame = () => {
  const [tablero, setTablero] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [combatInfo, setCombatInfo] = useState(null);
  const [playerHealth, setPlayerHealth] = useState(
    boardgame.players.barbarian.stats.health
  );

  useEffect(() => {
    let newTablero = boardgame.board.map((row) => [...row]);
    newTablero = generateEnemies(newTablero);

    const {
      newTablero: updatedTablero,
      playerPosition: initialPlayerPosition,
    } = generatePlayers(newTablero);

    setTablero(updatedTablero);
    setPlayerPosition(initialPlayerPosition);
  }, []);

  const handleMovement = (dx, dy) => {
    if (!playerPosition) return;

    const newPosition = movePlayer(dx, dy, tablero, setTablero, startCombat);
    if (newPosition) {
      setPlayerPosition(newPosition);
      setTablero((prevTablero) => {
        const updatedTablero = moveNpcs(prevTablero);
        return updatedTablero;
      });
    }
  };

  const removeMonsterFromBoard = (monsterId) => {
    setTablero((prevTablero) => {
      const newTablero = prevTablero.map((row) =>
        row.map((cell) => {
          if (typeof cell === "object" && cell.id === monsterId) {
            return 0;
          }
          return cell;
        })
      );
      return newTablero;
    });
  };

  const closeCombatModal = () => {
    setCombatInfo(null);
  };

  const startCombat = (monsterId) => {
    console.log(`ID del monstruo recibido en startCombat: ${monsterId}`);

    let monsterInfo = null;
    let monsterSymbol = null;

    for (let i = 0; i < tablero.length; i++) {
      for (let j = 0; j < tablero[i].length; j++) {
        const cell = tablero[i][j];
        if (typeof cell === "object" && cell.id === monsterId) {
          monsterSymbol = cell.symbol;
          console.log(`Monstruo encontrado con símbolo: ${monsterSymbol}`);
          monsterInfo =
            boardgame.enemies[
              Object.keys(boardgame.enemies).find(
                (key) => boardgame.enemies[key].symbol === monsterSymbol
              )
            ];
          console.log(`Información del monstruo encontrada:`, monsterInfo);
          break;
        }
      }
      if (monsterInfo) break;
    }

    if (!monsterInfo) {
      console.error("No se encontró el monstruo con la ID proporcionada.");
      return;
    }

    const barbarianStats = boardgame.players.barbarian.stats;

    if (monsterInfo.stats) {
      setCombatInfo({
        monsterId, // Asegúrate de pasar el ID del monstruo
        monsterType: monsterInfo.name,
        monsterAttack: monsterInfo.stats.attack,
        monsterDefense: monsterInfo.stats.defense,
        monsterHealth: monsterInfo.stats.health,
        player: barbarianStats.name,
        playerAttack: barbarianStats.attack,
        playerDefense: barbarianStats.defense,
        playerHealth, // Pasar la salud actual del jugador
        closeCombatModal,
        removeMonsterFromBoard,
        setPlayerHealth, // Pasar la función para actualizar la salud
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          handleMovement(-1, 0);
          break;
        case "ArrowDown":
          handleMovement(1, 0);
          break;
        case "ArrowLeft":
          handleMovement(0, -1);
          break;
        case "ArrowRight":
          handleMovement(0, 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tablero, playerPosition]);

  if (!Array.isArray(tablero) || tablero.length === 0) {
    return <div>Cargando tablero...</div>;
  }

  return (
    <div className="boardgame">
      <div className="player-health-container">
        <h3>Salud del Jugador: {playerHealth}</h3>
      </div>

      {tablero.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => {
            let className = "";
            if (typeof cell === "object") {
              switch (cell.symbol) {
                case "o":
                  className = "orc";
                  break;
                case "s":
                  className = "squeleton";
                  break;
                default:
                  break;
              }
            } else {
              switch (cell) {
                case 1:
                  className = "wall";
                  break;
                case 0:
                  className = "floor";
                  break;
                case 2:
                  className = "door";
                  break;
                case "B":
                  className = "barbarian";
                  break;
                case "x":
                  className = "exit";
                  break;
                default:
                  break;
              }
            }
            return <div key={j} className={className}></div>;
          })}
        </div>
      ))}

      {combatInfo && (
        <CombatCard
          className="combatCard"
          monsterId={combatInfo.monsterId}
          monsterType={combatInfo.monsterType}
          monsterAttack={combatInfo.monsterAttack}
          monsterDefense={combatInfo.monsterDefense}
          monsterHealth={combatInfo.monsterHealth}
          player={combatInfo.player}
          playerAttack={combatInfo.playerAttack}
          playerDefense={combatInfo.playerDefense}
          playerHealth={combatInfo.playerHealth}
          closeCombatModal={combatInfo.closeCombatModal}
          removeMonsterFromBoard={combatInfo.removeMonsterFromBoard}
          setPlayerHealth={combatInfo.setPlayerHealth}
        />
      )}
    </div>
  );
};

export default BoardGame;
