import React from 'react';
import styled from 'styled-components';
import { CELL_STATES, BOARD_WIDTH, FLAG_STATES } from '../services/Minesweeper';
import { Modal } from '@react95/core';
import { Status } from './Status';

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
  font-size: 25px;
  ${props => !(props.touched || props.hasMine) && `background-color: #ccc;`}
  ${props => props.touched && `background-color: steelblue;`}
  ${props => props.hasMine && `background-color: #ccc; ::before{ content: '💣'; position: relative; top: 2px; }`}
  ${props => props.flagged && `::before{ content: '⛳'; position: relative; top: 2px;}`}
  ${props => props.bomb && `background-color: red; ::before{ content: '💥' position: relative; top: 2px; }`}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.touched ? 'default' : 'pointer')};
  transition: background-color 300ms ease-out;
`;

export const Board = ({
  board,
  onPrimarySelectCell,
  onSecondarySelectCell,
}) => {
  return (
    <Modal
      icon="computer"
      title="Minesweeper"
      closeModal={() => {}}
      width="auto"
      height="auto"
    >
      <div>
        <StyledBoard>
          {board.map(cell => (
            <StyledCell
              key={cell.id}
              hasMine={cell.hasMine}
              touched={cell.state === CELL_STATES.TOUCHED}
              flagged={cell.flag === FLAG_STATES.FLAGGED}
              bomb={cell.state === CELL_STATES.TOUCHED && cell.hasMine}
              onClick={() => onPrimarySelectCell(cell)}
              onContextMenu={e => {
                e.preventDefault();
                onSecondarySelectCell(cell);
              }}
            >
              {cell.state === CELL_STATES.TOUCHED &&
                !cell.hasMine && cell.surroundingMineCount > 0 && (
                  <span>{cell.surroundingMineCount}</span>
                )}
              {/* {cell.id}({cell.surroundingMineCount}) */}
            </StyledCell>
          ))}
        </StyledBoard>
      </div>
    </Modal>
  );
};
