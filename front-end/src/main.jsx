import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import MainContent from "./components/MainContent.jsx";
import "./index.css";
import Inbox from "./pages/Inbox.jsx";
import InitialData from "./pages/InitialData.jsx";
import KnowledgeBase from "./pages/KnowledgeBase.jsx";
import Leads from "./pages/Leads.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Setup from "./pages/Setup.jsx";
import Signup from "./pages/Signup.jsx";
import Tickets from "./pages/Tickets.jsx";
import TurinAgent from "./pages/TurinAgent.jsx";
import { store } from "./store/store.js";

// Protected Route component to check if user has signed up
const ProtectedRoute = ({ children }) => {
  const businessState = JSON.parse(localStorage.getItem("businessState"));
  const isSignedUp = useSelector((state) => businessState.isSignedUp);
  return isSignedUp ? children : <Navigate to="/signup" replace />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/leads" element={<Leads />} />
          <Route
            path="/business/configurator"
            element={
              <ProtectedRoute>
                <InitialData />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/signup" replace />} />
            <Route
              path="main"
              element={
                <ProtectedRoute>
                  <MainContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="turin-agent"
              element={
                <ProtectedRoute>
                  <TurinAgent />
                </ProtectedRoute>
              }
            />
            <Route
              path="knowledge-base"
              element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              }
            />
            <Route
              path="setup"
              element={
                <ProtectedRoute>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
