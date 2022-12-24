import React from 'react'
import {useRecoilState,useSetRecoilState} from 'recoil'
import { roomsAtom, userAtom } from '../../context/chatStateManagment'
import { User } from '../../interfaces/chatInterfaces'

interface SidebarProps{
    user:User
}

const Sidebar = ({user}:SidebarProps) => {
  const setUser = useSetRecoilState(userAtom);
  const [rooms,setRooms] = useRecoilState(roomsAtom);
  //const [selectedRoom,setSelected] = useState<Room | null >();
  

  return (
    <section className='flex flex-col text-white m-5'>
        <h3 className='font-medium text-2xl '>User: {user.name}</h3>
        <div className='flex-1'>
          <p>Rooms</p>

        </div>
        <button className='bg-red-500 hover:bg-red-600 duration-150 p-2 rounded' onClick={()=>setUser(null)}>Leave</button>
    </section>
  )
}

export default Sidebar