import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import banToxic from "../../services/banToxic.service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

let socket;

const POSITIVE = "POSITIVE";
const NEGATIVE = "NEGATIVE";
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [msgToxic, setMsgToxic] = useState(false);
  const ENDPOINT = "https://chat-app-server-react.herokuapp.com";
  // const ENDPOINT = "localhost:5000";
  //Create socket

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    //connect socket server => (call io.on in socket server)
    socket = io(ENDPOINT, {
      transports: ["websocket"],
    });
    setName(name);
    setRoom(room);

    //send join request to socket
    socket.emit("join", { name: name, room: room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);
  //funtion for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      banToxic.checkToxic(message).then(
        (response) => {
          if (response.data === NEGATIVE) {
            toast.warning("Don't curse each other!!!");
            setMsgToxic(true);
            return;
          } else {
            socket.emit("sendMessage", message, () => {
              setMessage("");
              setMsgToxic(false);
            });
          }
        },
        (error) => {
          const message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          toast.error(message);
        }
      );
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          msgToxic={msgToxic}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};
export default Chat;
