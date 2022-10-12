import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GetGroupsA, GetUsersA, JoinGroupA } from "../../actions/chatActions";
import {
  findUsersCount,
  useAppDispatch,
  useAppSelector,
} from "../../utils/helpers";
import JoinComponentStyles from "./style.module.css";

const JoinComponent = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { groups, users, joinReqData } = useAppSelector((state) => state.ChatR);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(GetUsersA());
    dispatch(GetGroupsA());
  }, []);

  return (
    <div className={JoinComponentStyles.container}>
      <form
        className={JoinComponentStyles.form}
        onSubmit={handleSubmit((data: any) => {
          dispatch(JoinGroupA(data));
          if (joinReqData === "Ok") {
            navigate(`/group/${+data.group}`);
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