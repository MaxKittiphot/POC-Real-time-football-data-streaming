import React, { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const socket = io("http://localhost:5000");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("matchUpdate", (matchData) => {
       console.log({matchData})
      setMessages((prevMessages) => [...prevMessages, matchData]);
    });

    return () => {
      socket.off("matchUpdate");
    };
  }, [socket]);

  return <div className="App">
    <div>Football Live!!!</div>
    <div>{`Score ${messages.length !== 0 ? messages[messages.length-1].score : ``}`}</div>
    <ul>
      {messages.map((msg,index) => 
        <li key={index}>
           <strong>{msg.timestamp}</strong> - {msg.team} - {msg.event}
        </li>)}
    </ul>
  </div>;
}

export default App;

