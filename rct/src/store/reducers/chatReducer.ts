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
  },
});

export const { getGroups, getUsers } = ChatReducer.actions;
export default ChatReducer.reducer;
