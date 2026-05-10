import express from "express"
import { createServer } from "http"
import socketio from "socket.io"
import cors from "cors"
import { rooms } from "./rooms/rooms.store"
import { getWinner } from "./utils/getWinner"

const app = express()

app.use(cors())
app.use(express.json())

const rawServer = createServer(app)

const io = new socketio.Server(rawServer, {
    path: "/real-time",
    cors: {
        origin: "*"
    }
})

const PORT = 8080

rawServer.listen(PORT, () => {
    console.log("Server running :3")
})

io.on("connection", (socket) => {
    console.log(socket.id)

    // eliminar a todos los jugadores de una sala vacía

    function removePlayerFromAllRooms(playerId: string) {
        const ghostRoomIds: string[] = []

        for (let i = rooms.length - 1; i >= 0; i--) {
            const room = rooms[i]
            if (!room) continue

            const wasInRoom = room.players.some(player => player.id === playerId)
            if (!wasInRoom) continue

            room.players = room.players.filter(player => player.id !== playerId)
            ghostRoomIds.push(room.id)

            if (room.players.length === 0) {
                rooms.splice(i, 1)
            } else {
                io.to(room.id).emit("room-updated", room)
            }
        }

        if (ghostRoomIds.length > 0) {
            io.emit("rooms-updated", rooms)
        }

        return ghostRoomIds
    }

    // crear una sala :p

    socket.on("create-room", ({ roomId, alias }) => {
        const previousRooms = removePlayerFromAllRooms(socket.id)
        for (const previousRoomId of previousRooms) {
            socket.leave(previousRoomId)
        }

        const existingRoom = rooms.find(
            room => room.id === roomId
        )

        if (existingRoom) {
            socket.emit("room-already-exists")
            return
        }

        const newRoom = {
            id: roomId,
            players: [
                {
                    id: socket.id,
                    alias,
                    choice: undefined
                }
            ]
        }

        rooms.push(newRoom)

        socket.join(roomId)

        io.emit("rooms-updated", rooms)

        io.to(roomId).emit("player-joined", newRoom)
    })

    // entrar a una sala

    socket.on("join-room", ({ roomId, alias }) => {
        const previousRooms = removePlayerFromAllRooms(socket.id)
        for (const previousRoomId of previousRooms) {
            socket.leave(previousRoomId)
        }

        const room = rooms.find(roomGame => roomGame.id === roomId)

        if (!room) return

        if (room.players.length >= 2) {
            socket.emit("room-full")
            return
        }

        const player = {
            id: socket.id,
            alias,
            choice: undefined
        }

        room.players.push(player)

        socket.join(roomId)

        io.emit("rooms-updated", rooms)

        io.to(roomId).emit("player-joined", room)
    })

    // elección del jugador :p

    socket.on("make-choice", ({ roomId, choice }) => {
        const room = rooms.find(roomGame => roomGame.id === roomId)

        if (!room) return

        const player = room.players.find(
            playerGame => playerGame.id === socket.id
        )

        if (!player || player.choice) return

        player.choice = choice

        io.to(roomId).emit("room-updated", room)

        const readyPlayers = room.players.filter(
            player => player.choice
        )

        if (readyPlayers.length === 2) {
            const winner = getWinner(room)

            io.to(roomId).emit("game-finished", {
                room,
                winner
            })
        }
    })

    // reiniciar juegooo

    socket.on("restart-game", (roomId) => {
        const room = rooms.find(
            roomGame => roomGame.id === roomId
        )

        if (!room) return

        room.players.forEach(player => {
            player.choice = undefined
        })

        io.to(roomId).emit("game-restarted", room)
    })


    socket.on("leave-room", () => {
        const previousRooms = removePlayerFromAllRooms(socket.id)
        for (const previousRoomId of previousRooms) {
            socket.leave(previousRoomId)
        }
    })

    // desconexión :p
    socket.on("disconnect", () => {
        removePlayerFromAllRooms(socket.id)
    })
})
