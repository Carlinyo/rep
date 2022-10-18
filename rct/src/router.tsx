import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./components/chats/chats";
import LoginComponent from "./components/invitedUserLoginComponent/login-component";
import Admin from "./pages/admin";
import Chat from "./pages/chat";
import GroupChat from "./pages/group-chat";
import Home from "./pages/home";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group/:id" element={<GroupChat />} />
          <Route path="/private/:id" element={<Chat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login/:gmail" element={<LoginComponent />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Router;