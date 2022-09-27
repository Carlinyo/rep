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
  },
});

export const { getGroups } = ChatReducer.actions;
export default ChatReducer.reducer;