import emailjs from "emailjs-com";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { getGroups, getUsers } from "../../store/reducers/chatReducer";
import {
  findUsersCount,
  hashLinkGenerator,
  useAppDispatch,
  useAppSelector,
} from "../../utils/helpers";
import AdminStyles from "./style.module.css";

const AdminComponent = () => {
  const dispatch = useAppDispatch();
  const { groups, users } = useAppSelector((state) => state.ChatR);
  const socket = io("http://localhost:5001");
  const [createdUser, setCreatedUser] = useState();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
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
      socket.off("getusers");
      socket.off("getGroups");
      socket.off("disconnect");
    };
  }, []);
  return (
    <div className={AdminStyles.container}>
      <form
        className="w-25 p-3 border"
        onSubmit={handleSubmit((data) => {
          let token = hashLinkGenerator();
          data.link =
            "http://localhost:3000/login/" + data.to_email + "?token=" + token;
            console.log(data)
          socket.emit("createUser", { data, token });
          emailjs
            .send(
              "service_stbrhtp",
              "template_gjfw7ag",
              data,
              "fmktWsv3rCrws2mLP"
            )
            .then(
              (data) => {
                console.log("success", data);
              },
              function (error) {
                console.error("Error", error);
              }
            );
        })}
      >
        <div className="form-group pb-3">
          <label style={{ color: "white" }}>Enter Mail</label>
          <input
            type="email"
            placeholder="Enter User Gmail"
            {...register("to_email", { required: true })}
            className="form-control"
          />
        </div>
        <select
          multiple
          className="form-control w-50"
          {...register("groups", { required: true })}
        >
          {groups.map((group: Groups, index: number) => {
            return (
              <option key={index} value={group.id}>
                {group.name + " " + findUsersCount(users, group.id)}
              </option>
            );
          })}
        </select>
        <button className="btn btn-success">Send Invitation Link</button>
      </form>
    </div>
  );
};
export default AdminComponent;
