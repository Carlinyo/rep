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
  const navigate = useNavigate()
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
      <form onSubmit={handleSubmit((data:any)=>{
          dispatch(JoinGroupA(data))
          if(joinReqData === 'Ok'){
            navigate(`/group/${+data.group}`)
          }
        })}
      >
        <select {...register("group", { required: true })}>
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
        <div>
          <label>Username</label>
          <input type="text" {...register("username", { required: true })} />
        </div>
        {
          joinReqData!== 'Ok' && joinReqData !== '' &&
          <p style={{fontSize:'14px'}}>Name is taken. You can use <span><strong>{joinReqData}</strong></span> username.</p>
        }
        <button>
          Join
        </button>
      </form>
    </div>
  );
};
export default JoinComponent;