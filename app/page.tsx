"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import { BoardState, Player, Scoreboard, WinResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfettiExplosion from "react-confetti-explosion";
import { Plus_Jakarta_Sans } from "next/font/google";
import clsx from "clsx";

const initialBoard: BoardState = Array(9).fill(null);

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const checkWinner = (board: BoardState): WinResult | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }

  return null;
};

const getInitialScore = (): Scoreboard => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("scoreboard");
    if (stored) return JSON.parse(stored);
  }
  return { X: 0, O: 0, draws: 0 };
};

const saveScore = (score: Scoreboard) => {
  localStorage.setItem("scoreboard", JSON.stringify(score));
};

export default function Home() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winnerData, setWinnerData] = useState<WinResult | null>(null);
  const [score, setScore] = useState<Scoreboard>(getInitialScore);
  const isDraw = board.every(Boolean) && !winnerData;

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinnerData(result);
      setScore((prev) => ({
        ...prev,
        [result.winner!]: prev[result.winner!] + 1,
      }));
    } else if (isDraw) {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [board]);

  useEffect(() => {
    saveScore(score);
  }, [score]);

  const handleClick = (index: number) => {
    if (board[index] || winnerData) return;

    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer;
    setBoard(updatedBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer("X");
    setWinnerData(null);
  };

  const resetScoreboard = () => {
    const cleared = { X: 0, O: 0, draws: 0 };
    setScore(cleared);
    saveScore(cleared);
  };

  const hasStarted = board.some((cell) => cell !== null);

  return (
    <main
      className={`  flex min-h-screen  max-w-screen-md mx-auto  flex-col items-center relative justify-center p-4  gap-2 text-foreground ${jakarta.variable} font-sans`}
    >
      {winnerData && (
        <div className="absolute z-50">
          <ConfettiExplosion
            force={0.8}
            duration={2500}
            particleCount={100}
            width={1600}
            portal
          />
        </div>
      )}
      <div className="h-16 flex flex-col  items-center justify-center mb-2">
        <h1 className="text-2xl font-bold text-neutral-800">Tic Tac Toe</h1>
        <p className="text-md text-neutral-500">
          Challenge a friend. Take turns. Claim the win.
        </p>
      </div>
      <div className="h-10  w-full flex justify-center">
        {winnerData ? (
          <p className="text-green-600 font-medium">
            🎉 Player {winnerData.winner} wins!
          </p>
        ) : isDraw ? (
          <p className="text-yellow-500 font-medium">😐 It's a draw!</p>
        ) : (
          <p className="text-sm text-center text-zinc-500">
            Turn:
            <span
              className={clsx(
                currentPlayer === "X"
                  ? "bg-blue-500 text-white"
                  : currentPlayer === "O"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200",
                "ml-1 inline-flex items-center px-2 py-0.5 rounded text-md font-medium "
              )}
              // className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-md font-medium  text-zinc-800"
            >
              {currentPlayer}
            </span>
          </p>
        )}
      </div>
      <div className="grow grid-cols-1 gap-6 justify-center items-center  h-full grid md:grid-cols-2">
        <div className="flex flex-col p-2  rounded-2xl">
          <Board
            board={board}
            onClick={handleClick}
            winningLine={winnerData?.line}
          />
        </div>

        <div className=" h-full justify-center flex flex-col   gap-4 w-full ">
          <div className="w-24 h-12 mt-auto">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-sm ${
                hasStarted && !winnerData && !isDraw
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {hasStarted && !winnerData && !isDraw ? "Playing" : "Idle"}
            </span>
          </div>
          <div className="font-medium tracking-wide text-center ">
            Scoreboard
          </div>

          <div className="grid w-full grid-cols-3">
            {/* Player X */}
            <div className="flex justify-center items-center flex-col gap-2">
              <div className="relative flex justify-center items-center">
                <div className="absolute z-10 h-12 w-12 rounded-full bg-gray-100 shadow-inner"></div>
                <div className="z-20 h-10 w-10 rounded-full bg-blue-500 shadow-md"></div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2">
                Player X
              </p>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="grid grid-cols-3 items-start justify-center h-full w-full">
                <p className="text-3xl text-center font-semibold text-gray-700">
                  {score.X}
                </p>
                <p className="text-xl text-center font-semibold text-gray-500">
                  :
                </p>
                <p className="text-3xl text-center font-semibold text-gray-700">
                  {score.O}
                </p>
              </div>
              <p className="text-md font-medium text-yellow-500 ">
                {score.draws}
              </p>
            </div>

            {/* Player O */}
            <div className="flex justify-center items-center flex-col gap-2">
              <div className="relative flex justify-center items-center">
                <div className="absolute z-10 h-12 w-12 rounded-full bg-gray-100 shadow-inner"></div>
                <div className="z-20 h-10 w-10 rounded-full bg-rose-500 shadow-md"></div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2">
                Player O
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full mt-auto mb-auto">
            <Button
              variant="secondary"
              onClick={resetScoreboard}
              className="w-1/2"
            >
              Reset
            </Button>
            <Button
              variant="default"
              disabled={!winnerData && !isDraw}
              onClick={resetGame}
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
      <div className=" h-auto  mt-4 md:h-12 ">
        <p className="text-neutral-400 text-sm">
          Created by Ralph A. Villanueva
        </p>
      </div>
    </main>
  );
}
