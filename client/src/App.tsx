import io, { Socket } from 'socket.io-client';
import UserInput from './components/userInput/UserInput';
import {useRecoilState} from 'recoil'
import { roomsAtom, userAtom } from './context/chatStateManagment';
import Sidebar from './components/sideBar/Sidebar';
import Chat from './components/chat/Chat';

//const socket = io(`http://localhost:${process.env.PORT || 3001}`);
const socket = io();


function App() {
  
  const [user,setUser] = useRecoilState(userAtom);  

  if(!user) return <UserInput socket={socket}/>

  return (
    <div className="w-screen h-screen flex bg-[#20232B] overflow-hidden">
      
      <Sidebar user={user} socket={socket} />
      <Chat user={user} socket={socket}/>

    </div>
  );
}

export default App;
