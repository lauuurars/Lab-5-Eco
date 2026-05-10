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

    // crear una sala
    socket.on("create-room", (roomId) => {
        const existingRoom = rooms.find(
            room => room.id === roomId
        )

        if (existingRoom) {
            socket.emit("room-already-exists")
            return
        }

        rooms.push({
            id: roomId,
            players: [],
            status: "waiting"
        })

        io.emit("rooms-updated", rooms)
    })

    // entrar a una sala

    socket.on("join-room", ({ roomId, alias }) => {
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

        if (room.players.length === 2) {
            room.status = "full"
        }

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


    // desconexión :p

    socket.on("disconnect", () => {
        rooms.forEach(room => {
            room.players = room.players.filter(
                player => player.id !== socket.id
            )

            if (room.players.length < 2) {
                room.status = "waiting"
            }
        })

        const activeRooms = rooms.filter(
            room => room.players.length > 0
        )

        rooms.length = 0
        rooms.push(...activeRooms)

        io.emit("rooms-updated", rooms)
    })
})