import { Button, Stack, Title } from "@mantine/core";
import { useNavigate, Navigate } from "@tanstack/react-location";
import axios from "axios";
import React from "react";
import { useStore } from "../App";
import ChatDrawer from "../components/ChatDrawer";
import UserContext from "../UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { openChat, toggleTheme, socket } = useStore();
  const { user, setUser } = React.useContext(UserContext);

  const openLogin = () => navigate({ to: "/login" });
  const openRegister = () => navigate({ to: "/register" });

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    socket.disconnect();
  };

  if (user === null) return <Navigate to="/login" />;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Title order={4}>Welcome {user?.email}!</Title>
      <Stack
        spacing="xl"
        align="center"
        justify="center"
        style={{ height: "100%" }}
      >
        <Button onClick={toggleTheme}>Toggle Theme</Button>
        <Button onClick={openChat}>Open Drawer</Button>
        <Button onClick={openLogin}>Login</Button>
        <Button onClick={openRegister}>Register</Button>
        <Button onClick={logout}>Logout</Button>
        <ChatDrawer />
      </Stack>
    </div>
  );
};

export default Home;
