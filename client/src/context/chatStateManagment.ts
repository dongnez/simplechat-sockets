import { Room,Message,User } from './../interfaces/chatInterfaces';
import {atom,selector} from 'recoil'

//* User
export const userAtom = atom<User | null>({
    key:'user',
    default:null
})

//* Rooms
export const roomsAtom = atom<Array<Room>>({
    key:'rooms',
    default:[]
})


export const roomState = selector({
    key:'roomState',
    get:({get})=>{
        const rooms = get(roomsAtom);

        return {rooms}
    }
})