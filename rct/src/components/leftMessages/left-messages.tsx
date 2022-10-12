import React from "react"
import LeftMessagesStyles from './style.module.css'

const LeftMessages:React.FC<GroupMessages> = ({message,date,user}) =>{
    return (
        <div className={LeftMessagesStyles.message}>
            <p className={LeftMessagesStyles.user}>{user}</p>
            <p>{message}</p>
            <span>{date}</span>
        </div>
    )
}
export default LeftMessages