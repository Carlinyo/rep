import { useForm } from "react-hook-form";
import LoginComponentStyles from "./style.module.css";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const socket = io("http://localhost:5001");
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  return (
    <div className={LoginComponentStyles.container}>
      <form
        className="w-25 p-3 border"
        onSubmit={handleSubmit((data) => {
            console.log(data.password === data.passwordConfirm)
            if(data.password === data.passwordConfirm){
                console.log(1)
                socket.emit("login", data);
                navigate('/chats')
            }
          console.log(data);
        })}
      >
        <div className="form-group gap-3">
          <label>Userame</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="form-control"
          />
        </div>
        <div className="form-group gap-3">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="form-control"
          />
        </div>
        <div className="form-group gap-3">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("passwordConfirm", { required: true })}
            className="form-control"
          />
        </div>
        <button className="btn btn-success">Join</button>
      </form>
    </div>
  );
};

export default LoginComponent;
