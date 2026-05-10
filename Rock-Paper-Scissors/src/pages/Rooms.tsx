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
            <h1 className="text-4xl font-bold">
                Piedra Papel Tijera
            </h1>

            <input
                placeholder="Tu alias"
                className="border p-2 rounded"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
            />

            <input
                placeholder="Room ID"
                className="border p-2 rounded"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button
                onClick={handleCreateRoom}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Crear sala
            </button>

            <div className="flex flex-col gap-2 mt-6">
                {rooms.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => handleJoinRoom(room.id)}
                        className="border p-3 rounded"
                    >
                        {room.id} - {room.players.length >= 2 ? "full" : "waiting"}
                    </button>
                ))}
            </div>
        </div>
    )
}
