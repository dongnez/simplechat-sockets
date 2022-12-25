import React, { useState,useRef } from 'react'
import {useRecoilState,useSetRecoilState} from 'recoil'
import { backRoomAtom, roomsAtom, selectedRoomAtom, userAtom } from '../../context/chatStateManagment'
import { Room, User } from '../../interfaces/chatInterfaces'

interface SidebarProps{
    user:User,
    socket:any
}

const Sidebar = ({user,socket}:SidebarProps) => {
  const setUser = useSetRecoilState(userAtom);
  const setBackRoom = useSetRecoilState(backRoomAtom);
  const [rooms,setRooms] = useRecoilState(roomsAtom);
  const [selectedRoom,setSelected] = useRecoilState<Room | null >(selectedRoomAtom);
  const [joinText,setJoinText] = useState('');
  const inputJoin = useRef<any>();


  function joinRoom(){
    if(joinText.trim() === '') return;
    const newRoom:Room ={name:joinText};

    //If you are already in that room
    const repeat = rooms.findIndex((r)=>r.name == newRoom.name)
    setJoinText('');
    if(repeat != -1) return;

    setRooms((r)=>[...r,newRoom])
    inputJoin.current.value = '';
  }

  function selectRoom(room:Room){
    setBackRoom(true);
    if(room.name == selectedRoom?.name || !selectRoom) return;

    socket.emit("leave_room",selectedRoom);
    socket.emit("join_room",room);
    setSelected(room);
  }

  function onEnter(e:React.KeyboardEvent<HTMLInputElement>){
    if(e.key == 'Enter') joinRoom();
  }

  return (
    <section className='flex flex-col text-white p-5  h-full absolute w-full md:relative md:min-w-[340px] md:w-[340px] bg-[#1c1f27]'>
        <div className='flex items-center '>
          <h3 className='font-medium text-2xl flex-1'>User: {user.name}</h3>

          <input type='checkbox' name="hamburger" id='hamburger' className='peer' hidden />
          <label htmlFor='hamburger' className='peer-checked:hamburger block relative z-10 py-6 cursor-pointer '> 
            <div aria-hidden="true" className='m-auto h-0.5 w-6 rounded bg-sky-900 transition duration-300'></div>
            <div aria-hidden="true" className='m-auto mt-2 h-0.5 w-6 rounded bg-sky-900 transition duration-300'></div>
          </label>
          
          <div className='peer-checked:translate-x-[0] transition duration-200 fixed inset-0 w-full h-full  md:w-[340px] translate-x-[-100%] bg-[#2f323b]'>
            <div className='flex flex-col items-center justify-center h-full '>
              <img className='animate-bounce rounded-[3px]' src={require('../../assets/topg.gif')} alt="this slowpoke moves"  width="250" />
              <p className='text-sm'>Made by <a className='text-lg underline decoration-blue-400' href='https://github.com/dongnez'>Gnez</a> </p>
            </div>
          </div>

        </div>

        
        <section>
          <input ref={inputJoin} onChange={(e)=>setJoinText(e.target.value)} onKeyDown={(e)=>onEnter(e)} maxLength={20}  placeholder='Join Room' type='text'  className=' mb-3 outline-none border border-gray-100 bg-transparent rounded-md p-2 text-xl'/>
          <button onClick={joinRoom} className='p-2 bg-[#F2FB89] hover:bg-[#a3ac49] duration-150 text-xl rounded-md ml-2'>👉</button>      
        </section>

        <div className='flex-1 overflow-auto scrollbar'>
          <h3 className='font-medium text-xl'>Rooms</h3>
          {!rooms[0] && <p>No roms</p>}
          <>{rooms.map((item,index)=>{

            return(
              <div onClick={()=>selectRoom(item)} key={index} className='my-2 flex items-center gap-2 p-3 rounded-xl hover:bg-[#111418]'>
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