import React, { useState } from 'react';
import { Modal } from '@react95/core';
import './App.css';
import {
  generateBoard,
  primaryTouchCell,
  getSurroundingCells,
  secondaryCellTouch,
  NUM_MINES,
  getFlaggedCells,
} from './services/Minesweeper';
import { Board } from './components/Board';
import { Status } from './components/Status';

const initialBoard = generateBoard();

const View = () => {
  const [board, setBoard] = useState(initialBoard);
  const [numberOfMinesDetected, setNumberOfMinesDetected] = useState(0);
  const [gameStatus, setGameStatus] = useState('IN_PROGRESS');

  const onPrimarySelectCell = cell => {
    console.log('primary select', cell);
    const newBoard = primaryTouchCell(cell, board);
    setBoard(newBoard);
    const surroundingCells = getSurroundingCells(cell, board);
    console.log('Surrounding Cell', surroundingCells);
  };

  const onSecondarySelectCell = cell => {
    console.log('secondary select', cell);
    const newBoard = secondaryCellTouch(cell, board);
    setBoard(newBoard);
    setNumberOfMinesDetected(getFlaggedCells(newBoard).length);
  };

  return (
    <div className="App">
      <Modal
        icon="computer"
        title="Minesweeper"
        closeModal={() => { }}
        width="auto"
        height="auto"
      ><Status numberOfMinesLeft={NUM_MINES - numberOfMinesDetected} gameStatus={gameStatus} />
        <Board
          board={board}
          onPrimarySelectCell={onPrimarySelectCell}
          onSecondarySelectCell={onSecondarySelectCell}
        /></Modal>

    </div>
  );
};

export default View;
