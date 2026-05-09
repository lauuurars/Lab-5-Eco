import express, { Request, Response } from "express"
import { createServer } from "http"
import socketio from "socket.io"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Hola si funciona")
})

const rawServer = createServer(app)

rawServer.listen(8070, () => {
    console.log("server running!")
})

const io = new socketio.Server(rawServer, {
    path: "/real-time",
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("enter-name", (name) => {
        console.log("el usuario", socket.id, name);

        io.emit("new-name", name)
    })
})