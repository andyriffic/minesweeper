import React, { useState } from 'react';
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
      <Status numberOfMinesLeft={NUM_MINES - numberOfMinesDetected}/>
      <Board
        board={board}
        onPrimarySelectCell={onPrimarySelectCell}
        onSecondarySelectCell={onSecondarySelectCell}
      />
    </div>
  );
};

export default View;
