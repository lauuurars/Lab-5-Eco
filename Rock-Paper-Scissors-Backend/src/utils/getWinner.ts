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
        (p1.choice === "Piedra" && p2.choice === "Tijeras") ||
        (p1.choice === "Papel" && p2.choice === "Piedra") ||
        (p1.choice === "Tijeras" && p2.choice === "Papel")
    ) {
        return p1.id
    }

    return p2.id
}
