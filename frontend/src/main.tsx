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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/auth" element={<AuthSupa />} />
          <Route path="/admin/createQuiz" element={<QuizForm />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          {/* <Route path='/quiz' element={<QuizForm/>} /> */}
          <Route path="/admin/showQuiz" element={<ShowQuiz />} />
          <Route path="/waiting" element={<WaitingRoom />} />
          <Route path="/join" element={<WaitingRoom />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
