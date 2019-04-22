import React, { useState } from 'react';
import './App.css';
import {
  generateBoard,
  primaryTouchCell,
  getSurroundingCells,
  secondaryCellTouch,
} from './services/Minesweeper';
import { Board } from './components/Board';

const initialBoard = generateBoard();

const View = () => {
  const [board, setBoard] = useState(initialBoard);

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
  };

  return (
    <div className="App">
      <Board
        board={board}
        onPrimarySelectCell={onPrimarySelectCell}
        onSecondarySelectCell={onSecondarySelectCell}
      />
    </div>
  );
};

export default View;
