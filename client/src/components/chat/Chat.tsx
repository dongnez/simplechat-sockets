import React,{useRef,useState,useEffect} from 'react'
import { Message, User } from '../../interfaces/chatInterfaces';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io-client';

interface ChatProps{
    socket:Socket<DefaultEventsMap, DefaultEventsMap>
    user:User
}

const Chat = ({socket,user}:ChatProps) => {
    const [allMessages, setAllMessages] = useState<Array<Message>>([]); //
    const [sendMessage, setSendMessage] = useState('');

    const inputSend = useRef<any>();
    const bottomChat = useRef<any>();
  
  useEffect(() => {
    socket.on('message', (data) => {
      setAllMessages((s) => [...s, data]);
    });

    return ()=> {socket.off('message')}
  }, []);

  useEffect(()=>{
    scrollEnd();
  },[allMessages])

  function funSendMessage() {
    if (sendMessage.trim() === '' || !user) return;
    
    const newMessage:Message = {message:sendMessage,user:user?.name}
    socket.emit('message', newMessage);
    
    setAllMessages((m)=>[...m,newMessage])
    inputSend.current.value = '';
    setSendMessage('');
  }

  function enterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      funSendMessage();
    }
  }

  function scrollEnd(){
    bottomChat.current?.scrollIntoView({ behavior: "smooth" })
  }
  
   return (
    <div className='max-w-[800px] m-auto flex flex-col bg-[#1D1E24]  text-white w-full h-full '>
    <section className='flex bg-[#000000] rounded-t-2xl p-3 '>
      GroupName
    </section>
    
    <div className='flex-1 m-5 px-2 font-sans font-normal overflow-auto scrollbar'>
      {allMessages.map((item, index) => {
        return (
          <>{user.name ==item.user ? 
          <div className='flex items-end self-end justify-end my-2' key={index}>
            <p className='w-fit bg-[#B785F5] text-xl px-3 py-[6px] rounded-md rounded-br-none'>{item.message}</p>
          </div>
          :
          <div className='my-2' key={index}>
             <span className='text-lime-500 '>{item.user}</span>
             <p className='break-all bg-[#16171B] text-xl w-fit px-4 py-2 rounded-md rounded-tl-none'> {item.message}</p>
          </div>
          } </>
          
        );
      })}
      <div ref={bottomChat} />
    </div>

    <div className='flex bg-[#16171B] rounded-md m-2'>
      <input className=' break-all outline-none bg-transparent p-2 flex-1'
        placeholder='Enter message'
        ref={inputSend} type={'text'} onChange={(e) => setSendMessage(e.target.value)} onKeyDown={(e) => enterPress(e)}
      />
      <button className='bg-green-400 p-2 m-2 rounded-md hover:bg-green-500 duration-200' onClick={funSendMessage}>Send</button>
    </div>
  </div>
  )
}

export default Chat