import React from "react";
import RightMessagesStyles from "./style.module.css";

const RightMessages: React.FC<GroupMessages> = ({ message, date, user }) => {
  return (
    <div className={RightMessagesStyles.message}>
      <p className={RightMessagesStyles.user}>{user}</p>
      <p>{message}</p>
      <span>{date}</span>
    </div>
  );
};
export default RightMessages;
