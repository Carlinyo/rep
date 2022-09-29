import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const findUsersCount = (users:any,groupId:number) => {
    let count = users.filter((el:any)=>el.group.id === groupId)
    if(count.length === 5){
        return "Full"
    }
    return count.length
}