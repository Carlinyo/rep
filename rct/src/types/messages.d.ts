declare global {
  interface Message {
    message: string;
    date: string;
  }
  interface From {
    id: number;
    username: string;
  }
  interface GroupMessages {
    from?: From;
    date: string;
    message: string;
    group?: Groups;
    user?: string;
  }
  interface SendGroupData {
    from: string | null;
    message: Message;
    group: string | undefined;
  }
  interface PrivateMessage {
    id: number;
    from: number;
    to: number;
    message: string;
  }
  interface JoinedUserMessage {
    id?:number;
    user:string;
    group:string;
    message:string;
    date:string;
  }
  interface LeftUsersMessage{
    
  }
}
export {};
