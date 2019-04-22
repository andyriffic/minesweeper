import React from 'react';
import styled from 'styled-components';
import { CELL_STATES, BOARD_WIDTH, FLAG_STATES } from '../services/Minesweeper';

const StyledBoard = styled.div`
  width: 500px;
  height: 500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(${BOARD_WIDTH}, ${100 / BOARD_WIDTH}%);
  grid-template-rows: repeat(${BOARD_WIDTH}, ${100 / BOARD_WIDTH}%);
`;

const StyledCell = styled.div`
  border: 1px solid black;
  ${props => !(props.touched || props.hasMine) && `background-color: #ccc;`}
  ${props => props.touched && `background-color: steelblue;`}
  ${props => props.hasMine && `background-color: orange;`}
  ${props => props.flagged && `background-color: darkgreen;`}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.touched ? 'default' : 'pointer')};
`;

export const Board = ({
  board,
  onPrimarySelectCell,
  onSecondarySelectCell,
}) => {
  return (
    <StyledBoard>
      {board.map(cell => (
        <StyledCell
          key={cell.id}
          hasMine={cell.hasMine}
          touched={cell.state === CELL_STATES.TOUCHED}
          flagged={cell.flag === FLAG_STATES.FLAGGED}
          onClick={() => onPrimarySelectCell(cell)}
          onContextMenu={e => {
            e.preventDefault();
            onSecondarySelectCell(cell);
          }}
        >
          {cell.state === CELL_STATES.TOUCHED &&
            cell.surroundingMineCount > 0 && (
              <span>{cell.surroundingMineCount}</span>
            )}
          {/* {cell.id}({cell.surroundingMineCount}) */}
        </StyledCell>
      ))}
    </StyledBoard>
  );
};
