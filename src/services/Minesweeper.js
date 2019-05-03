export const CELL_STATES = {
  UNTOUCHED: 'UNTOUCHED',
  TOUCHED: 'TOUCHED',
};

export const FLAG_STATES = {
  FLAGGED: 'FLAGGED',
  QUESTION: 'QUESTION',
};

export const BOARD_WIDTH = 9;
export const NUM_MINES = 10;

const getMineIndexes = board => {
  const mineIndexes = [];
  for (let mine = 0; mine < NUM_MINES; mine++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * (board.length - 1));
    } while (mineIndexes.includes(randomIndex));
    mineIndexes.push(randomIndex);
  }
  console.log('mines', mineIndexes);
  return mineIndexes;
};

export const getSurroundingCells = (cell, board) => {
  const surroundingCells = [];

  getTopLeftCell(cell, board, cell => surroundingCells.push(cell));
  getTopCell(cell, board, cell => surroundingCells.push(cell));
  getTopRightCell(cell, board, cell => surroundingCells.push(cell));
  getLeftCell(cell, board, cell => surroundingCells.push(cell));
  getRightCell(cell, board, cell => surroundingCells.push(cell));
  getBottomLeftCell(cell, board, cell => surroundingCells.push(cell));
  getBottomCell(cell, board, cell => surroundingCells.push(cell));
  getBottomRightCell(cell, board, cell => surroundingCells.push(cell));

  return surroundingCells;

  // const topLeftCell = board[cell.id - (BOARD_WIDTH + 1)];
  // const topCell = board[cell.id - (BOARD_WIDTH)];
  // const topRightCell = board[cell.id - (BOARD_WIDTH - 1)];

  // const leftCell = board[cell.id - 1];
  // const rightCell = board[cell.id + 1];

  // const bottomLeftCell = board[cell.id + (BOARD_WIDTH - 1)];
  // const bottomCell = board[cell.id + (BOARD_WIDTH)];
  // const bottomRightCell = board[cell.id + (BOARD_WIDTH + 1)];
};

const onSameRow = (cell1Index, cell2Index) =>
  Math.floor(cell1Index / BOARD_WIDTH) === Math.floor(cell2Index / BOARD_WIDTH);

const tooFarAway = (cell1Index, cell2Index) =>
  Math.abs(
    Math.floor(cell1Index / BOARD_WIDTH) - Math.floor(cell2Index / BOARD_WIDTH)
  ) > 1;

const getTopLeftCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id - (BOARD_WIDTH + 1);
  if (targetCellIndex < 0) return;
  if (
    onSameRow(targetCellIndex, targetCell.id) ||
    tooFarAway(targetCellIndex, targetCell.id)
  )
    return;

  onMatch(board[targetCellIndex]);
};

const getTopCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id - BOARD_WIDTH;
  if (targetCellIndex < 0) return;

  onMatch(board[targetCellIndex]);
};

const getTopRightCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id - (BOARD_WIDTH - 1);
  if (targetCellIndex < 0) return;
  if (onSameRow(targetCellIndex, targetCell.id)) return;

  onMatch(board[targetCellIndex]);
};

const getLeftCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id - 1;
  if (targetCellIndex < 0) return;
  if (!onSameRow(targetCellIndex, targetCell.id)) return;

  onMatch(board[targetCellIndex]);
};

const getRightCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id + 1;
  if (targetCellIndex > board.length - 1) return;
  if (!onSameRow(targetCellIndex, targetCell.id)) return;

  onMatch(board[targetCellIndex]);
};

const getBottomLeftCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id + (BOARD_WIDTH - 1);
  if (targetCellIndex > board.length - 1) return;
  if (onSameRow(targetCellIndex, targetCell.id)) return;

  onMatch(board[targetCellIndex]);
};

const getBottomCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id + BOARD_WIDTH;
  if (targetCellIndex > board.length - 1) return;

  onMatch(board[targetCellIndex]);
};

const getBottomRightCell = (targetCell, board, onMatch) => {
  const targetCellIndex = targetCell.id + (BOARD_WIDTH + 1);
  if (targetCellIndex > board.length - 1) return;
  if (
    onSameRow(targetCellIndex, targetCell.id) ||
    tooFarAway(targetCellIndex, targetCell.id)
  )
    return;

  onMatch(board[targetCellIndex]);
};

const fillBoardStates = board => {
  board.forEach(cell => {
    const surroundingCells = getSurroundingCells(cell, board);
    surroundingCells.forEach(surroundingCell => {
      if (surroundingCell.hasMine) {
        cell.surroundingMineCount++;
      }
    });
  });
};

export const generateBoard = () => {
  const board = [];
  for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
    board.push({
      id: i,
      state: CELL_STATES.UNTOUCHED,
      hasMine: false,
      surroundingMineCount: 0,
      flag: null,
    });
  }

  const mineIndexes = getMineIndexes(board);
  mineIndexes.forEach(i => {
    board[i].hasMine = true;
  });

  fillBoardStates(board);

  return board;
};

export const getFlaggedCells = (board) => {
  return board.filter(cell => cell.flag === FLAG_STATES.FLAGGED);
}

export const touchAllMines = (board) => {

  for (let i = 0; i < board.length; i++) {
    if (board[i].hasMine) {
      // console.log('Touching mine', newBoard[i]);
      touchCellOnBoard(board[i], board);
      // console.log('Touched mine', newBoard[i]);
    }
  }
}

export const primaryTouchCell = (cell, board) => {
  if (cell.flag || cell.state !== CELL_STATES.UNTOUCHED) {
    return board;
  }

  const newBoard = [...board];
  cascadeTouchCell(cell, newBoard, () => {
    console.log('BOOM!!');
  }); // SIDE-EFFECT!

  if (cell.hasMine) {
    touchAllMines(newBoard);
  }

  return newBoard;
};

export const secondaryCellTouch = (cell, board) => {
  if (cell.state === CELL_STATES.TOUCHED) {
    return board;
  }

  const updatedCell = {
    ...cell,
    flag: cell.flag ? null : FLAG_STATES.FLAGGED,
  };

  const newBoard = [...board];
  newBoard[cell.id] = updatedCell;
  return newBoard;
};

const touchCellOnBoard = (cell, board) => {
  const updatedCell = {
    ...cell,
    flag: null,
    state: CELL_STATES.TOUCHED,
  };
  board[cell.id] = updatedCell;
  return updatedCell;
};

const cascadeTouchCell = (cell, board, onMineReveal) => {
  if (cell.state === CELL_STATES.TOUCHED) {
    return;
  }

  touchCellOnBoard(cell, board); // SIDE-EFFECT!

  if (cell.hasMine) {
    onMineReveal();
    return;
  }

  if (cell.surroundingMineCount === 0) {
    const surroundingCells = getSurroundingCells(cell, board);
    surroundingCells.forEach(surroundingCell => {
      if (surroundingCell.hasMine) {
        return;
      }

      if (surroundingCell.surroundingMineCount >= 0) {
        cascadeTouchCell(surroundingCell, board);
      }
      // if (surroundingCell.surroundingMineCount > 0) {
      //   touchCellOnBoard(surroundingCell, board);
      // }
    });
  }
};
