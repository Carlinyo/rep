import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../utils/helpers";
import GroupChatStyles from "./style.module.css";
import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import LeftMessages from "../leftMessages/left-messages";
import RightMessages from "../rightMessages/right-messages";
import { getGroupData } from "../../store/reducers/chatReducer";

const GroupChatComponent = () => {
  const [active, setActive] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const socket = io("http://localhost:5001");
  const [joinedUser, setJoinedUser] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm();
  const { id } = useParams();
  const { groupData } = useAppSelector((state) => state.ChatR);
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinedUser", {user:localStorage.getItem("userId"),group:id});
      socket.emit("message", id);
      setIsConnected(true);
      socket.emit("groupMessage", { id, status: 100 });
    });
    socket.on("typing", (data) => {
      if (
        data.status === "false" ||
        data.from === localStorage.getItem("userId")
      ) {
        setIsTyping(false);
      } else if (data.status === "true") {
        setIsTyping(true);
      }
    });
    socket.on("groupData", (data) => {
      console.log(data);
      dispatch(getGroupData(data));
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("groupData");
      socket.off("typing");
      socket.off("groupData");
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
            <div>
              {groupData?.users?.map((user: User, index: number) => {
                return <p key={index}>{user.username}</p>;
              })}
            </div>
          )}
          {isTyping && (
            <div className={GroupChatStyles.chat_bubble}>
              <div className={GroupChatStyles.typing}>
                <div className={GroupChatStyles.dot}></div>
                <div className={GroupChatStyles.dot}></div>
                <div className={GroupChatStyles.dot}></div>
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmit((data: FieldValues | any) => {
              let minutes =
                +new Date().getMinutes() < 10
                  ? "0" + new Date().getMinutes()
                  : new Date().getMinutes();
              let date = new Date().getHours() + ":" + minutes;
              data.group = id;
              let message = { date, message: data.message };
              let groupMessage = {
                from: localStorage.getItem("userId"),
                message,
                group: id,
              };
              socket.emit("groupMessage", groupMessage);
              reset();
            })}
            className={GroupChatStyles.send_form}
          >
            <textarea
              placeholder="Message..."
              className="form-control"
              maxLength={255}
              onInput={(e: any) =>
                socket.emit("input", {
                  typing: e.target.value,
                  userId: localStorage.getItem("userId"),
                })
              }
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
