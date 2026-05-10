import { useState } from "react"

import type { ReactNode } from "react"
import type { Room } from "../types/game.types"

import { GameContext } from "./game.context"

export function GameProvider({
    children
}: {
    children: ReactNode
}) {
    const [room, setRoom] = useState<Room | null>(null)

    const [alias, setAlias] = useState("")

    const [winner, setWinner] =
        useState<string | null>(null)

    return (
        <GameContext.Provider
            value={{
                room,
                setRoom,
                alias,
                setAlias,
                winner,
                setWinner
            }}
        >
            {children}
        </GameContext.Provider>
    )
}