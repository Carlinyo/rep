import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/chat";
import GroupChat from "./pages/group-chat";
import Home from "./pages/home";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group:id" element={<GroupChat />} />
          <Route path="/private:id" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Router;