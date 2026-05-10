import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { socket } from "../socket/socket"
import ChoiceButton from "../components/ChoiceButton"

import type { Choice, Room } from "../types/game.types"

export default function Game() {
    const { roomId } = useParams()

    const navigate = useNavigate()

    const [room, setRoom] = useState<Room | null>(null)

    const [selectedChoice, setSelectedChoice] =
        useState<Choice | null>(null)

    useEffect(() => {
        socket.on("room-updated", (updatedRoom) => {
            setRoom(updatedRoom)
        })

        socket.on("player-joined", (updatedRoom) => {
            setRoom(updatedRoom)
        })

        socket.on("game-finished", ({ room, winner }) => {
            navigate(`/result/${room.id}`, {
                state: {
                    room,
                    winner
                }
            })
        })

        return () => {
            socket.off("room-updated")
            socket.off("player-joined")
            socket.off("game-finished")
        }
    }, [navigate])

    function handleChoice(choice: Choice) {
        if (selectedChoice) return

        setSelectedChoice(choice)

        socket.emit("make-choice", {
            roomId,
            choice
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-bold">
                Sala {roomId}
            </h1>

            <p>
                Estado:
                {" "}
                {room?.players.length === 2
                    ? "Listos"
                    : "Esperando jugador"}
            </p>

            <div className="flex gap-4">
                <ChoiceButton
                    choice="rock"
                    onClick={() => handleChoice("rock")}
                    disabled={!!selectedChoice}
                />

                <ChoiceButton
                    choice="paper"
                    onClick={() => handleChoice("paper")}
                    disabled={!!selectedChoice}
                />

                <ChoiceButton
                    choice="scissors"
                    onClick={() => handleChoice("scissors")}
                    disabled={!!selectedChoice}
                />
            </div>

            {selectedChoice && (
                <p>Elegiste: {selectedChoice}</p>
            )}
        </div>
    )
}