import axios from "axios";
import React from "react";
import { useEffectOnce } from "./hooks/useEffectOnce";
import { io } from "socket.io-client";
import { useStore } from "./App";
import { showNotification } from "@mantine/notifications";
const SERVER = "http://127.0.0.1:8080";
const socket = io(SERVER, { autoConnect: false });

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(undefined);
  const { addMessage } = useStore();
  const addMessageRef = React.useRef();
  const isConnected = React.useRef(false);
  addMessageRef.current = addMessage;

  useEffectOnce(() => {
    useStore.setState({ socket });

    socket.on("chat-message", (data) => {
      const { userID, message } = data;

      addMessageRef.current(`${socket.id} ${message}`);
    });

    socket.on("user-connected", (data) => {
      console.log(data);
      showNotification({
        title: "Connection Update!",
        message: `${data.userName} has connected to our chat!`,
      });
    });

    socket.on("user-disconnected", (data) => {
      showNotification({
        title: "Connection Update!",
        message: `${data.userName} has disconnected from our chat!`,
      });
    });
  });

  React.useEffect(() => {
    if (!user || isConnected.current) return;

    socket.auth = { user };
    socket.connect();

    isConnected.current = true;
  }, [user]);

  // Determine if the user is logged in, if they are acquire their data.
  const getLoggedIn = async () => {
    axios
      .get("/auth/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
      });
  };

  useEffectOnce(() => {
    getLoggedIn();
  });

  return (
    <UserContext.Provider
      value={{
        getLoggedIn: getLoggedIn,
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export { UserContextProvider };
