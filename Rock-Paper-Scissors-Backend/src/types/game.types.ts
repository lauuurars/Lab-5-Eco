export type Choice = "rock" | "paper" | "scissors"

export interface Player {
    id: string
    alias: string
    choice: Choice | undefined
}

export interface Room {
    id: string
    players: Player[]
    status: "waiting" | "full"
}