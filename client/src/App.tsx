import io from 'socket.io-client';
import UserInput from './components/userInput/UserInput';
import {useRecoilState} from 'recoil'
import { roomsAtom, userAtom } from './context/chatStateManagment';
import Sidebar from './components/sideBar/Sidebar';
import Chat from './components/chat/Chat';

const socket = io('http://localhost:3001');

function App() {
  
  const [user,setUser] = useRecoilState(userAtom);

  if(!user) return <UserInput/>

  return (
    <div className="w-screen h-screen flex bg-[#20232B]">
      
      <Sidebar user={user} />
      <Chat user={user} socket={socket}/>

    </div>
  );
}

export default App;
