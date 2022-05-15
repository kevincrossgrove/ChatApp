import "./App.css";
import create from "zustand";
import { MantineProvider } from "@mantine/core";
import { UserContextProvider } from "./UserContext";
import { ReactLocation, Router } from "@tanstack/react-location";
import { routes } from "./routes";
import axios from "axios";
import { NotificationsProvider } from "@mantine/notifications";

const reactLocation = new ReactLocation();

export const useStore = create((set) => ({
  theme: true,
  toggleTheme: () => set((state) => ({ theme: !state.theme })),
  open: false,
  openChat: () => set((state) => ({ ...state, open: true })),
  closeChat: () => set((state) => ({ ...state, open: false })),
  messages: [],
  addMessage: (newMessage) =>
    set((state) => ({ ...state, messages: [...state.messages, newMessage] })),
  socket: null,
}));

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
  const { theme } = useStore();

  return (
    <MantineProvider
      theme={{ colorScheme: theme ? "dark" : "light" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <UserContextProvider>
          <Router location={reactLocation} routes={routes} />
        </UserContextProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
