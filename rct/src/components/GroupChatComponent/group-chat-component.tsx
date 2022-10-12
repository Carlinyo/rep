import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { GetGroupDataA } from "../../actions/chatActions";
import {
  useAppDispatch,
  useAppSelector,
  useOnClickOutside,
} from "../../utils/helpers";
import GroupChatStyles from "./style.module.css";
import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import { ChatService } from "../../services/chat-services";
import LeftMessages from "../leftMessages/left-messages";
import RightMessages from "../rightMessages/right-messages";

const GroupChatComponent = () => {
  const [active, setActive] = useState(false);
  const ref: any = useRef();
  const socket = io();
  useOnClickOutside(ref, () => setActive(false));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const { groupData } = useAppSelector((state) => state.ChatR);
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    socket.on("connect", () => {
      console.log('connected')
      setIsConnected(true);
    });
    socket.on('message',(message)=>{
      console.log(message)
    })
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("getgroupData", (data) => {
        console.log(data)
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <>
      <div className={GroupChatStyles.container}>
        <div className={GroupChatStyles.chat}>
          <div className={GroupChatStyles.title}></div>
          {groupData?.messages?.map((message: GroupMessages, index: number) => {
            let Message: any = message.message;
            let user: any = message.from;
            return (
              <div key={index} className={GroupChatStyles.messagesContainer}>
                <div className={GroupChatStyles.leftMessages}>
                  {message?.from?.id + "" !==
                    localStorage.getItem("userId") && (
                    <LeftMessages
                      key={index}
                      message={Message.message}
                      date={Message.date}
                      user={user.username}
                    />
                  )}
                </div>
                <div className={GroupChatStyles.rightMessages}>
                  {message?.from?.id + "" ===
                    localStorage.getItem("userId") && (
                    <RightMessages
                      key={index}
                      message={Message.message}
                      date={Message.date}
                      user={user.username}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {active && (
            <div ref={ref}>
              {groupData?.users?.map((user: User, index: number) => {
                return <p key={index}>{user.username}</p>;
              })}
            </div>
          )}
          <form
            onSubmit={handleSubmit((data: FieldValues | any) => {
              let date = new Date().getHours() + ":" + new Date().getMinutes();
              data.group = id;
              let message = { date, message: data.message };
              let groupMessage = {
                from: localStorage.getItem("userId"),
                message,
                group: id,
              };
              socket.emit("chat", groupMessage);
              reset();
            })}
            className={GroupChatStyles.send_form}
          >
            <textarea
              placeholder="Message..."
              className="form-control"
              maxLength={255}
              {...register("message", { required: true })}
            ></textarea>
            <button className="btn btn-success">Send</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default GroupChatComponent;