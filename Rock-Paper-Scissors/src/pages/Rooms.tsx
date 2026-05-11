import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { socket } from "../socket/socket"
import type { Room } from "../types/game.types"

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [roomId, setRoomId] = useState("")
    const [alias, setAlias] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        socket.emit("leave-room")

        socket.on("rooms-updated", (updatedRooms) => {
            setRooms(
                updatedRooms.filter(
                    (room: Room) => room.players.length > 0
                )
            )
        })

        socket.on("room-full", () => {
            alert("Sala llena")
        })

        return () => {
            socket.off("rooms-updated")
            socket.off("room-full")
        }
    }, [])

    function handleCreateRoom() {
        if (!roomId || !alias) return

        socket.emit("create-room", {
            roomId,
            alias
        })

        navigate(`/game/${roomId}`)
    }

    function handleJoinRoom(id: string) {
        socket.emit("join-room", {
            roomId: id,
            alias
        })

        navigate(`/game/${id}`)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-violet-600 mb-3">
                Piedra, Papel o Tijera 🎮
            </h1>

            <input required
                placeholder="Username"
                className="border p-2 rounded border-violet-400 focus:outline-none focus:ring focus:ring-violet-800 focus:border-violet-800"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
            />

            <input
                placeholder="Room ID"
                className="border p-2 rounded border-violet-400 focus:outline-none focus:ring focus:ring-violet-800 focus:border-violet-800"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button
                onClick={handleCreateRoom}
                className="bg-violet-500 hover:bg-violet-700 transition-all cursor-pointer text-white font-medium px-4 py-2 rounded"
            >
                Crear sala
            </button>

            
            <div className="flex flex-col gap-2 mt-6">

            <h1 className="text-center text-2xl font-semibold text-violet-600" >Salas Disponibles</h1>

                {rooms.length === 0 ? (
                    <p className="text-center text-violet-500">
                        No hay salas en este momento :C
                    </p>
                ) : (
                    rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => handleJoinRoom(room.id)}
                            className="border-2 p-3 rounded border-violet-500 text-violet-500 font-medium hover:border-violet-700 hover:text-violet-700 cursor-pointer"
                        >
                            {room.id} - {room.players.length >= 2 ? "Llena" : "Esperando"}
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}
