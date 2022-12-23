import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { log } from 'console';

const socket = io('http://localhost:3001');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [sendMessage, setSendMessage] = useState('');
  const [allMessages, setAllMessages] = useState<Array<string>>([]);
  const inputSend = useRef<any>();

  useEffect(() => {
    /* socket.on('receive_message', (data) => {
      console.log('Mensaje:', data);
      setAllMessages((s) => [...s, data]);
    }); */

    socket.on('receive_message', (data) => {
      console.log(data);
      setAllMessages((s) => [...s, data]);
    });
  }, [socket]);

  function funSendMessage() {
    if (sendMessage.trim() === '') return;

    socket.emit('send_message', sendMessage);
    inputSend.current.value = '';
    setSendMessage('');
  }

  function enterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      funSendMessage();
    }
  }

  return (
    <div className="App">
      <p>Frontend</p>
      <input
        ref={inputSend}
        type={'text'}
        onChange={(e) => setSendMessage(e.target.value)}
        onKeyDown={(e) => enterPress(e)}
      />
      <button onClick={funSendMessage}>Send</button>

      <>
        {allMessages.map((item, index) => {
          return (
            <div>
              <p>{item}</p>
            </div>
          );
        })}
      </>
    </div>
  );
}

export default App;
