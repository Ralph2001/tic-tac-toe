"use client";

import { Player } from "@/types";

type Props = {
  value: Player;
  onClick: () => void;
  highlight?: boolean;
};

export default function Square({ value, onClick, highlight = false }: Props) {
  return (
    <button
      disabled={value ? true : false}
      onClick={onClick}
      className={`w-20 h-20 disabled:cursor-not-allowed border border-gray-300 cursor-pointer md:w-24 md:h-24 text-3xl md:text-4xl text-gray-800 font-semibold rounded-lg 
        flex items-center justify-center transition-all duration-300 select-none
        ${
          highlight
            ? "bg-green-100 text-green-600 animate-pulse scale-105"
            : "hover:bg-muted"
        },
        ${value ? "bg-gray-100" : "bg-white"}
      `}
    >
      {value}
    </button>
  );
}
