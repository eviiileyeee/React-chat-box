import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import './App.css';

const port = process.env.PORT || 3001;
const socket = io(`http://localhost:${port}`);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newMessage, setnewMessage] = useState('');
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('socket connected', socket.connected);
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [isConnected]);

  useEffect(() => {
    socket.on('receive_message', ({ user, message }) => {
      const msg = `${user}: ${message}`;
      setMessages((prevMessages) => [msg, ...prevMessages]);
    });
  }, [socket]);

  const handleEnterChatRoom = () => {
    if (user!=="" && room!=="") {
      socket.emit('join_room', { user, room });
      setChatVisible(true);
    }
  };

  const handleSendMessage = () => {
    const newMsgData = {
      room: room,
      user: user,
      message: newMessage,
    };
    socket.emit('send_message', newMsgData);
    const msg = `${user} Send: ${newMessage}`;
    setMessages((prevMessages) => [msg, ...prevMessages]);
    setnewMessage('');
  };

  return (
    <div className='chat-container'>
      {!chatVisible ? (
        <div className='chat-input'>
          <input type='text' placeholder='Username' value={user} onChange={(e) => setUser(e.target.value)} />
          <input type='text' placeholder='Room' value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={handleEnterChatRoom}>Enter Chat</button>
        </div>
      ) : (
        <>
          <div className='chat-messages'>
            {messages.map((el) => (
              <div key={v4}>{el}</div>
            ))}
          </div>
          <div className='chat-input'>
            <input type='text' placeholder='Message' value={newMessage} onChange={(e) => setnewMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
