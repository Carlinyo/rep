import { createSlice } from "@reduxjs/toolkit";
import { ChatTypes } from "../../constants/types/types";
import { ChatState } from "../state/chatState";

const ChatReducer = createSlice({
  name: ChatTypes.stateType,
  initialState: ChatState,
  reducers: {
    getGroups(state, action) {
      state.groups = action.payload;
    },
    getUsers(state, action) {
      state.users = action.payload;
    },
    getJoinReqData(state,action){
      state.joinReqData = action.payload
    },
    getGroupData(state,action){
      state.groupData = action.payload
    }
  },
});

export const { getGroups, getUsers, getJoinReqData, getGroupData } = ChatReducer.actions;
export default ChatReducer.reducer;