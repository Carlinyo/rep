import { useEffect } from "react";
import { GetGroupsA, GetUsersA } from "../actions/chatActions";
import { useAppDispatch, useAppSelector } from "../utils/helpers";

const JoinComponent = () => {
  const { groups, users } = useAppSelector((state) => state.ChatR);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(GetUsersA());
    dispatch(GetGroupsA());
  }, []);
  console.log(groups, users);
  return (
    <div>
      <form action="">
        <select name="groups">
          {groups?.map((group, index) => {
            return <option key={index}>{group.name}</option>;
          })}
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
