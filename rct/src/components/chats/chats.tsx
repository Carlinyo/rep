import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChartsStyles from "./style.module.css";

const Chats = () => {
  const socket = io("http://localhost:5001");
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  useEffect(() => {
    socket.on('connect',()=>{
        setIsConnected(true)
    })
    socket.on('disconnect',()=>{
        setIsConnected(false)
    })
    return ()=>{
        socket.off('connect')
        socket.off('disconnect')
    }
  }, []);
  return (
    <div className={ChartsStyles.container}>
        
    </div>
  );
};
export default Chats;