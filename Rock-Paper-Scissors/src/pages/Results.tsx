import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { Player } from "../types/game.types"
import { socket } from "../socket/socket"

export default function Results() {
    const navigate = useNavigate()

    const { state } = useLocation()

    const { room, winner } = state

    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (countdown <= 0) return

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [countdown])

    useEffect(() => {
        socket.on("game-restarted", (updatedRoom) => {
            navigate(`/game/${updatedRoom.id}`, {
                state: {
                    room: updatedRoom
                }
            })
        })

        return () => {
            socket.off("game-restarted")
        }
    }, [navigate])

    function restartGame() {
        socket.emit("restart-game", room.id)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            {countdown > 0 ? (
                <h1 className="text-6xl font-bold text-violet-700">
                    {countdown}
                </h1>
            ) : (
                <>
                    <h1 className="text-4xl font-bold text-violet-600">
                        Resultado 🕹️
                    </h1>

                    <div className="flex gap-8">
                        {room.players.map((player: Player) => (
                            <div key={player.id}>
                                <h2 className="text-[23px] font-medium text-violet-500">{player.alias}</h2>
                                <p className="text-violet-800">{player.choice}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-violet-500">
                        {winner === "draw" ? "Empate" : `Ganador: ${room.players.find(
                            (player: Player) => player.id === winner
                        )?.alias
                            }`}
                    </h2>

                    <button
                        onClick={restartGame}
                        className="bg-violet-500 hover:bg-violet-700 transition-all cursor-pointer text-white font-medium px-4 py-2 rounded"
                    >
                        Reiniciar
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="border-2 px-4 py-2 rounded text-violet-500 font-medium cursor-pointer border-violet-500 hover:border-violet-700 hover:text-violet-700"
                    >
                        Volver
                    </button>
                </>
            )}
        </div>
    )
}