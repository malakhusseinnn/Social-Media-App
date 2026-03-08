import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Notfound from "./Components/Notfound/Notfound";
import CounterContextProvider from "./Context/CounterContext";
import { HeroUIProvider } from "@heroui/react";
import Profile from "./Components/Profile/Profile";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./ProtectedRoute/AuthProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ToastContainer } from "react-toastify";
import { useNetworkState } from "react-use";
import DetectOffline from "./Components/DetectOffline/DetectOffline";
import Settings from "./Components/Settings/Settings";
import UserProfile from "./Components/UserProfile/UserProfile";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
       {
        path: "profile/:id",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtectedRoute>
            <Register />{" "}
          </AuthProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  const query = new QueryClient();
  const { online } = new useNetworkState();
  return (
    <>
      {!online && <DetectOffline />}
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <HeroUIProvider>
            <CounterContextProvider>
              <RouterProvider router={router}></RouterProvider>
              <ToastContainer />
            </CounterContextProvider>
          </HeroUIProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
