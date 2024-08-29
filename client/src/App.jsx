import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MessagePro from "./context/MessageProvider";
import Chat from "./components/Chat";

function App() {
  const heloo = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/chat",
      element: <Chat />,
    },
  ]);

  return (
    <>
      <MessagePro>
        <RouterProvider router={heloo}></RouterProvider>
      </MessagePro>
    </>
  );
}

export default App;
