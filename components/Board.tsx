'use client';

import { BoardState } from '@/types';
import Square from './Square';

type Props = {
  board: BoardState;
  onClick: (index: number) => void;
  winningLine?: number[];
};

export default function Board({ board, onClick, winningLine }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          highlight={winningLine?.includes(index)}
        />
      ))}
    </div>
  );
}
