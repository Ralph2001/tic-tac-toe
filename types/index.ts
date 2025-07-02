export type Player = 'X' | 'O' | null;

export type BoardState = Player[];

export type Scoreboard = {
  X: number;
  O: number;
  draws: number;
};

export type WinResult = {
  winner: Player;
  line: number[];
};
