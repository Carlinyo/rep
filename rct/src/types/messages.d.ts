declare global {
  interface Message{
    message:string;
    date:string;
  }
  interface From{
    id:number;
    username:string;
  }
  interface GroupMessages {
    from?: From;
    date: string;
    message:string
    group?:Groups
    user?:string
  }
  interface SendGroupData{
    from:string | null;
    message:Message;
    group:string | undefined;
  }
  interface PrivateMessage {
    id: number;
    fromId: number;
    toId: number;
    message: string;
  }
}
export {}