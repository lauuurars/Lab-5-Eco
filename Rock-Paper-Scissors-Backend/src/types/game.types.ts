export type Choice = "Piedra" | "Papel" | "Tijeras"

export interface Player {
    id: string
    alias: string
    choice: Choice | undefined
}

export interface Room {
    id: string
    players: Player[]
}
