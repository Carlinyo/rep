import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  findUsersCount,
  useAppDispatch,
  useAppSelector,
} from "../../utils/helpers";
import JoinComponentStyles from "./style.module.css";
import { io } from "socket.io-client";
import { getGroups, getUsers } from "../../store/reducers/chatReducer";

const JoinComponent = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { groups, users, joinReqData } = useAppSelector((state) => state.ChatR);
  const socket = io("http://localhost:5001");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useAppDispatch();
  useEffect(() => {
    localStorage.setItem('count','0')
    socket.on("connect", () => {
      socket.emit("getGroups");
      socket.emit("getUsers");
      setIsConnected(true);
    });
    socket.on("getUsers", (users) => {
      dispatch(getUsers(users));
    });
    socket.on("getGroups", (groups) => {
      dispatch(getGroups(groups));
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getUsers");
      socket.off("getGroups");
      socket.off("status");
    };
  }, []);

  return (
    <div className={JoinComponentStyles.container}>
      <form
        className={JoinComponentStyles.form}
        onSubmit={handleSubmit((data: any) => {
          socket.emit("join", data);
          socket.on("status", (data) => {
            if (data.status === "Ok") {
              localStorage.count = '0';
              localStorage.userId = data.user?.id;
              localStorage.username = data.user?.username;
              navigate(`/group/${data.user.group}`);
            }
          });
          if (joinReqData === "Ok") {
          }
        })}
      >
        <div className={JoinComponentStyles.form_part1_container}>
          <label>Select Group</label>
          <select
            {...register("group", { required: true })}
            className="form-control"
          >
            {groups?.map((group, index) => {
              return (
                <>
                  {findUsersCount(users, group.id) !== "Full" && (
                    <option key={index} value={group.id}>
                      {group.name} {findUsersCount(users, group.id)}
                    </option>
                  )}
                  {findUsersCount(users, group.id) === "Full" && (
                    <option key={index} value={group.id} disabled>
                      {group.name} {findUsersCount(users, group.id)}
                    </option>
                  )}
                </>
              );
            })}
          </select>
          {errors.group && <p style={{ color: "red" }}>Select Group</p>}
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="form-control"
          />
          {errors.username && (
            <p style={{ color: "red" }}>Username Field is empty</p>
          )}
        </div>
        {joinReqData !== "Ok" && joinReqData !== "" && (
          <p style={{ fontSize: "14px" }}>
            Name is taken. You can use{" "}
            <span>
              <strong>{joinReqData}</strong>
            </span>
            {""}
            username.
          </p>
        )}
        <button className="btn btn-success">Join</button>
      </form>
    </div>
  );
};
export default JoinComponent;
