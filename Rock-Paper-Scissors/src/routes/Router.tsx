import { createBrowserRouter, Navigate } from "react-router-dom"
import Rooms from '../pages/Rooms'

const router = createBrowserRouter(
    [
        {
            path: "/",
            Component: Rooms
        },

        { path: "*", element: <Navigate to="/" replace /> },
    ]
)

export default router