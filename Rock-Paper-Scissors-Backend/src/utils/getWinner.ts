import { Room } from "../types/game.types"

export function getWinner(room: Room) {
    const [p1, p2] = room.players

    if (!p1 || !p2) {
        return null
    }

    if (!p1.choice || !p2.choice) {
        return null
    }

    if (p1.choice === p2.choice) {
        return "draw"
    }

    if (
        (p1.choice === "rock" && p2.choice === "scissors") ||
        (p1.choice === "paper" && p2.choice === "rock") ||
        (p1.choice === "scissors" && p2.choice === "paper")
    ) {
        return p1.id
    }

    return p2.id
}