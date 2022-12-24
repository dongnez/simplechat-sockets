import React, { useState,useRef } from 'react'
import {useRecoilState,useSetRecoilState} from 'recoil'
import { roomsAtom, selectedRoomAtom, userAtom } from '../../context/chatStateManagment'
import { Room, User } from '../../interfaces/chatInterfaces'

interface SidebarProps{
    user:User,
    socket:any
}

const Sidebar = ({user,socket}:SidebarProps) => {
  const setUser = useSetRecoilState(userAtom);
  const [rooms,setRooms] = useRecoilState(roomsAtom);
  const [selectedRoom,setSelected] = useRecoilState<Room | null >(selectedRoomAtom);
  const [joinText,setJoinText] = useState('');
  const inputJoin = useRef<any>();


  function joinRoom(){
    if(joinText.trim() === '') return;
    const newRoom:Room ={name:joinText};
    
    //* Sockets Join and Leave
    //if(selectedRoom) socket.leave(selectedRoom); //Salimos de una y entramos en otra
    socket.emit("join_room",newRoom);
    
    
    setSelected(newRoom);
    setRooms((r)=>[...r,newRoom])
    setJoinText('');
    inputJoin.current.value = '';
  }

  return (
    <section className='flex flex-col text-white m-5'>
        <h3 className='font-medium text-2xl'>User: {user.name}</h3>
        
        <section>
          <input ref={inputJoin} onChange={(e)=>setJoinText(e.target.value)} placeholder='Join Room' type='text'  className=' my-3 outline-none border border-gray-100 bg-transparent rounded-md p-2 text-xl'/>
          <button onClick={joinRoom} className='p-2 bg-[#F2FB89] hover:bg-[#a3ac49] duration-150 text-xl rounded-md ml-2'>👉</button>      
        </section>

        <div className='flex-1'>
          <h3 className='font-medium text-xl'>Rooms</h3>
          {!rooms[0] && <p>No roms</p>}
          <>{rooms.map((item,index)=>{

            return(
              <div key={index} className='my-2 flex items-center gap-2 p-3 rounded-xl hover:bg-[#111418]'>
                <div className='bg-white w-10 h-10 text-black rounded-full flex items-center justify-center p-2'>{item.name.slice(0,2)}</div>
                <p>{item.name}</p>
              </div>
            )
          })}
          </>

        </div>
        <button className='bg-red-500 hover:bg-red-600 duration-150 p-2 rounded' onClick={()=>setUser(null)}>Leave</button>
    </section>
  )
}

export default Sidebar