import React from "react";
import { useStore } from "../App";
import UserContext from "../UserContext";

const useChatSocket = () => {
  const { socket } = useStore();
  const { user } = React.useContext(UserContext);

  const sendMessage = (message) => {
    console.log("Hit", message, socket, socket.auth);
    socket.emit("chat-message", { userID: user._id, message });
  };

  return { sendMessage };
};

export default useChatSocket;
