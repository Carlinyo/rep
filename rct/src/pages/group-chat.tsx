import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { GetGroupDataA } from "../actions/chatActions"
import { useAppDispatch } from "../utils/helpers"

const GroupChat = () =>{
    const {id} = useParams()
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(GetGroupDataA(id))
    },[])
    return (
        <>
        </>
    )
}
export default GroupChat