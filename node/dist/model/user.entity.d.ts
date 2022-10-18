import { groups } from "./groups.entity";
export declare class User {
    id: number;
    username: string;
    group: number;
    groups: groups[];
}
