import { Button, Container, Drawer, TextInput } from "@mantine/core";
import React from "react";
import { useStore } from "../App";
import useChatSocket from "../hooks/useChatSocket";

const ChatDrawer = () => {
  const { open, closeChat, addMessage, messages } = useStore();
  const [message, setMessage] = React.useState("");
  const { sendMessage } = useChatSocket();

  const send = (e) => {
    e.preventDefault();
    sendMessage(message);
    addMessage("Me: " + message);
    setMessage("");
  };

  return (
    <Drawer opened={open} onClose={closeChat} position="right" size={600}>
      <Container>
        <h5>Hello World</h5>
        <div className="messages-container">
          {messages.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </div>
        <form onSubmit={send} className="input-container">
          <TextInput
            style={{ width: "100%" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </Container>
    </Drawer>
  );
};

export default ChatDrawer;
