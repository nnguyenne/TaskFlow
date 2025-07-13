import Home from '../pages/Home';
import Login from '../pages/Login';
import LayoutDefault from '../Layout/LayoutDefault';
import Register from '../pages/Register';
import Error404 from '../pages/Error404';
import PrivateRouter from '../components/PrivateRouter';
import TestCheck from '../pages/Test';
import Tasks from '../pages/Tasks';
import Chat from '../pages/Chat';
export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                element: <PrivateRouter />,
                children: [
                    {
                        path: "task",
                        element: <Tasks />
                    },
                    {
                        path: "chat",
                        children: [
                            { index: true, element: <Chat /> },
                            { path: ":conversationId", element: <Chat /> },
                        ]
                    },
                    {
                        path: "test",
                        element: <TestCheck />
                    },
                    {
                        path: "test",
                        children: [
                            { index: true, element: <TestCheck /> },
                            { path: ":conversationId", element: <TestCheck /> },
                        ]
                    },
                ]
            },
        ],
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },
    {
        path: "*",
        element: <Error404 />
    }
]
