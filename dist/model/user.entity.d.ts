import { groups } from "./groups.entity";
export declare class User {
    id: number;
    username: string;
    groupId: number;
    groups: groups[];
}
