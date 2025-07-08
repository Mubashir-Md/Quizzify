import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuizForm from "./components/Admin/QuizForm.tsx";
import ShowQuiz from "./components/Admin/ShowQuiz.tsx";
import WaitingRoom from "./components/User/WaitingRoom.tsx";
import HomePage from "./components/HomePage.tsx";
import AuthSupa from "./components/Admin/AuthSupa.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import ProfilePage from "./components/Admin/ProfilePage.tsx";
import AdminNavbar from "./components/Admin/AdminNavbar.tsx";
import LaunchQuiz from "./components/Admin/LaunchQuiz.tsx";
import StartingQuiz from "./components/Admin/StartingQuiz.tsx";
import { SocketProvider } from "./contexts/SocketProvider.tsx";
import QuestionsPage from "./components/User/QuestionsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AdminNavbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthSupa />} />
            <Route path="/admin/createQuiz" element={<QuizForm />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/launch/:quizId/:roomId" element={<LaunchQuiz />} />
            <Route
              path="/admin/startQuiz/:quizId/:roomId"
              element={<StartingQuiz />}
            />
            <Route path="/admin/showQuiz" element={<ShowQuiz />} />
            <Route path="/waiting" element={<WaitingRoom />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/join" element={<WaitingRoom />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
