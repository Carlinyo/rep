import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import GroupChatComponent from "../GroupChatComponent/group-chat-component";
import ChatsStyles from "./style.module.css";

const Chats = () => {
  const socket = io("http://localhost:5001");
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("getUserByToken", localStorage.getItem("token"));
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("userByToken", (data) => {
      setChats(data);
      localStorage.userId = data[0].user.id;
      localStorage.username = data[0].user.username;
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  return (
    <div className={ChatsStyles.parentContainer}>
      <div className={ChatsStyles.container}>
        <div className={ChatsStyles.canvas}>
          <div className={ChatsStyles.openChats}>
            {chats?.map((chat: any, index: number) => {
              return (
                <button
                  key={index}
                  className={ChatsStyles.chatButton}
                  onClick={() => setSelectedChat(chat.group.id)}
                >
                  {chat.group.name}
                </button>
              );
            })}
          </div>
          {selectedChat !== 0 && (
            <div className={ChatsStyles.chat}>
              <GroupChatComponent id={selectedChat} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Chats;