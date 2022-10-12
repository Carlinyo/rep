import { ChatService } from "../services/chat-services";
import {
  getGroupData,
  getGroups,
  getJoinReqData,
  getUsers,
} from "../store/reducers/chatReducer";

export const GetGroupsA = () => (dispatch: (xxx: any) => Groups) => {
  ChatService.getGroups().then((data) => {
    dispatch(getGroups(data));
  });
};
export const GetUsersA = () => (dispatch: (xxx: any) => User) => {
  ChatService.getUsers().then((data) => {
    dispatch(getUsers(data));
  });
};
export const JoinGroupA = (group: Groups) => (dispatch: (xxx: any) => any) => {
  ChatService.joinGroup(group).then((data: any) => {
    dispatch(getJoinReqData(data));
  });
};
export const GetGroupDataA =
  (id: string | undefined) => (dispatch: (xxx: any) => Groups) => {
    ChatService.getGroupData(id).then((data) => {
      dispatch(getGroupData(data));
    });
  };
