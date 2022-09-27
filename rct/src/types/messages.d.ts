declare global {
  interface GroupMessages {
    id: number;
    fromId: number;
    groupId: number;
    message: string;
  }
  interface PrivateMessage {
    id: number;
    fromId: number;
    toId: number;
    message: string;
  }
}
export {}