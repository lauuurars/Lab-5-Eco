import { createContext } from "react"

import type { Room } from "../types/game.types"

interface GameContextProps {
    room: Room | null
    setRoom: (room: Room | null) => void

    alias: string
    setAlias: (alias: string) => void

    winner: string | null
    setWinner: (winner: string | null) => void
}

export const GameContext =
    createContext<GameContextProps>(
        {} as GameContextProps
    )