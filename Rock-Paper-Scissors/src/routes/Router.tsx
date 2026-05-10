import { createBrowserRouter, Navigate } from "react-router-dom"
import Rooms from "../pages/Rooms"
import Game from '../pages/Game';
import Results from "../pages/Results";


const router = createBrowserRouter(
    [
        {
            path: "/",
            Component: Rooms
        },
        {
            path: "/game/:roomId",
            Component: Game
        },
        {
            path: "/result/:roomId",
            Component: Results
        },

        { path: "*", element: <Navigate to="/" replace /> },
    ]
)

export default router