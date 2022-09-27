import { useEffect } from "react";
import { GetGroupsA } from "../actions/chatActions";
import { useAppDispatch, useAppSelector } from "../utils/helpers";

const JoinComponent = () => {
  const { groups } = useAppSelector((state) => state.ChatR);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(GetGroupsA());
  }, []);
  console.log(groups);
  return (
    <div>
      <form action="">
        <select name="groups">
          {
            groups?.map((group,index)=>{
              return (
                <option key={index}>{group.name}</option>
              )
            })
          }
        </select>
        <div>
          <label>Username</label>
          <input type="text" name="username" />
        </div>
        <button>Join</button>
      </form>
    </div>
  );
};
export default JoinComponent;
