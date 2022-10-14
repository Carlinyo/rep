import { GroupDto } from "./group.dto";
export class JoinMessagesDto {
  id?: number;
  message: string;
  date: string;
  group: GroupDto;
}