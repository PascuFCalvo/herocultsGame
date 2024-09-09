/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./combatCard.css";

const CombatCard = ({
  className,
  monsterType,
  monsterAttack,
  monsterDefense,
  monsterHealth,
  player,
  playerAttack,
  playerDefense,
  playerHealth,
  removeMonsterFromBoard,
  closeCombatModal,
  setPlayerHealth,
  monsterId, // Asegúrate de recibir el ID del monstruo
}) => {
  const [playerAttackDices] = useState(playerAttack);
  const [playerDefenseDices] = useState(playerDefense);
  const [monsterAttackDices] = useState(monsterAttack);
  const [monsterDefenseDices] = useState(monsterDefense);
  const [playerHealthPoints, setPlayerHealthPoints] = useState(playerHealth);
  const [monsterHealthPoints, setMonsterHealthPoints] = useState(monsterHealth);
  const [combatMessage, setCombatMessage] = useState("");

  useEffect(() => {
    if (monsterHealthPoints <= 0) {
      setCombatMessage(`El enemigo ${monsterType} ha sido eliminado.`);
      setTimeout(() => {
        closeCombatModal();
        removeMonsterFromBoard(monsterId); // Pasar el ID del monstruo para eliminarlo
      }, 1000);
    } else if (playerHealthPoints <= 0) {
      setCombatMessage(`El jugador ha sido derrotado.`);
      setTimeout(() => {
        closeCombatModal();
        // Aquí puedes agregar lógica para manejar la derrota del jugador
      }, 1000);
    }
  }, [
    monsterHealthPoints,
    playerHealthPoints,
    closeCombatModal,
    removeMonsterFromBoard,
    monsterType,
    monsterId, // Incluir monsterId en las dependencias
  ]);

  const rollDice = (numDices) => {
    return Array.from(
      { length: numDices },
      () => Math.floor(Math.random() * 6) + 1
    );
  };

  const calculateHits = (attackDices, defenseDices) => {
    const attack = rollDice(attackDices);
    const defense = rollDice(defenseDices);
    let hits = attack.filter((dice) => dice >= 4).length;
    hits -= defense.filter((dice) => dice >= 5).length;
    return Math.max(hits, 0);
  };

  const handlePlayerAttack = () => {
    console.log(`Player attacking monster ${monsterType}`);
    const hits = calculateHits(playerAttackDices, monsterDefenseDices);
    if (hits > 0) {
      setMonsterHealthPoints((prevHealth) => Math.max(prevHealth - hits, 0));
    }
  };

  const handleMonsterAttack = () => {
    console.log(`Monster attacking ${player}`);
    const hits = calculateHits(monsterAttackDices, playerDefenseDices);
    if (hits > 0) {
      setPlayerHealthPoints((prevHealth) => Math.max(prevHealth - hits, 0));
      setPlayerHealth((prevHealth) => Math.max(prevHealth - hits, 0));
    }
  };

  const handleAttack = () => {
    handlePlayerAttack();
    if (monsterHealthPoints > 0) {
      handleMonsterAttack();
    } else {
      setCombatMessage(`El enemigo ${monsterType} ha sido eliminado.`);
      setTimeout(() => {
        closeCombatModal();
        removeMonsterFromBoard(monsterId); // Pasar el ID del monstruo para eliminarlo
      }, 1000);
    }
  };

  return (
    <div className={className}>
      <h2>
        Combat: {monsterType} vs. {player}
      </h2>
      <div>
        <h3>{player} Stats</h3>
        <p>Attack: {playerAttack}</p>
        <p>Defense: {playerDefense}</p>
        <p>Health: {playerHealthPoints}</p>
        <button onClick={handleAttack}>Attack</button>
      </div>
      <div>
        <h3>{monsterType} Stats</h3>
        <p>Attack: {monsterAttack}</p>
        <p>Defense: {monsterDefense}</p>
        <p>Health: {monsterHealthPoints}</p>
      </div>
      {combatMessage && <div className="combat-message">{combatMessage}</div>}
    </div>
  );
};

export default CombatCard;
