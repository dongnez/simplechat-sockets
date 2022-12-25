import React,{useRef,useState,useEffect} from 'react'
import { Message, User } from '../../interfaces/chatInterfaces';
import { Socket } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import { backRoomAtom, selectedRoomAtom } from '../../context/chatStateManagment';

interface ChatProps{
    socket:any
    user:User
}

const Chat = ({socket,user}:ChatProps) => {
  const selectedRoom = useRecoilValue(selectedRoomAtom);
  const  [backRoom,setBackRoom] = useRecoilState(backRoomAtom); 
  const [allMessages, setAllMessages] = useState<Array<Message>>([]); 
  const [sendMessage, setSendMessage] = useState('');
  const inputSend = useRef<any>();
  const bottomChat = useRef<any>();
  
  useEffect(() => {
    socket.on('message', (data:any) => {
      setAllMessages((s) => [...s, data]);
    });

    return ()=> {socket.off('message')}
  }, []);

  useEffect(()=>{
    scrollEnd();
  },[allMessages])

  useEffect(()=>{
    setAllMessages([]);
  },[selectedRoom])

  function funSendMessage() {
    if (sendMessage.trim() === '' || !user ||!selectedRoom) return;
    
    const newMessage:Message = {message:sendMessage,userId:user.id,userName:user.name,room:selectedRoom.name}
    socket.emit('message', newMessage);
    
    setAllMessages((m)=>[...m,newMessage])
    inputSend.current.value = '';
    setSendMessage('');
  }

  function enterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') funSendMessage();
  }

  function scrollEnd(){
    bottomChat.current?.scrollIntoView({ behavior: "smooth" })
  }

    if(!selectedRoom) return <h1 className='text-white rounded-lg  text-center text-5xl w-fit bg-[#101014] p-5 m-auto '>No Selected Room</h1>

   return (
    <div className={`${'max-w-[800px] m-auto  flex flex-col  text-white w-full h-full z-20  md:pt-10  fixed md:relative duration-300   md:translate-x-0'}
    ${backRoom ? 'translate-x-0':'translate-x-[100%]'}`}>
    
    <div className='bg-[#1D1E24] rounded-t-2xl flex-1 flex flex-col h-full '>
    <section className='flex bg-[#000000] rounded-t-2xl  items-center gap-2 md:p-3'>
      <svg onClick={()=>setBackRoom(false)} className='md:hidden scale-50 group/back'  width="40" height="60" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline className='group-hover/back:stroke-[#ddd] duration-150 mx-5' points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="6" stroke-linecap="butt" fill="none" stroke-linejoin="round">&gt;</polyline>
      </svg>
      <p className='text-lg font-semibold'>{selectedRoom.name}</p>
    </section>
    
    <div className='flex-1 m-5 px-2 font-sans font-normal  overflow-auto scrollbar '>
      {allMessages.map((item, index) => {
        return (
          <div key={index}>{user.id ==item.userId ? 
          <div className='flex items-end self-end justify-end my-2'>
            <p className='break-all w-fit bg-[#B785F5] text-xl px-3 py-2 rounded-lg rounded-br-none'>{item.message}</p>
          </div>
          :
          <div className='my-2'>
             <span className='text-lime-500 '>{item.userName}</span>
             <p className='break-all bg-[#16171B] text-xl w-fit px-5 py-2 rounded-lg rounded-tl-none'> {item.message}</p>
          </div>
          } </div>
          
        );
      })}
      <div ref={bottomChat} />
    </div>

    <div className='flex bg-[#16171B] rounded-md m-2'>
      <input maxLength={100} className=' break-all outline-none bg-transparent p-2 flex-1'
        placeholder='Enter message' 
        ref={inputSend} type={'textarea'} onChange={(e) => setSendMessage(e.target.value)} onKeyDown={(e) => enterPress(e)}
      />
      <button className='bg-green-400 p-2 m-2 rounded-md hover:bg-green-500 duration-200' onClick={funSendMessage}>Send</button>
    </div>
    </div>
  </div>
  )
}

export default Chat