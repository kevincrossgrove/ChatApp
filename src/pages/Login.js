import {
  Button,
  Card,
  Center,
  Group,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { Navigate, useNavigate } from "@tanstack/react-location";
import axios from "axios";
import React from "react";
import { useStore } from "../App";
import UserContext from "../UserContext";

const initialData = {
  email: "",
  password: "",
};

const Login = () => {
  const [data, setData] = React.useState(initialData);
  const { user, setUser } = React.useContext(UserContext);
  const { socket } = useStore();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  if (user) return <Navigate to="/" />;

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", data);
      const user = response.data;

      setUser(user);
      socket.connect();
      navigate({ to: "/" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Center style={{ width: "100vw", height: "100vh" }}>
      <Card style={{ minWidth: 350, maxWidth: 550, width: "100%" }}>
        <Title order={3}>Login</Title>
        <Space h="md" />
        <form onSubmit={login}>
          <TextInput
            label="Username"
            name="email"
            value={data.email}
            onChange={onChange}
            required
          />
          <PasswordInput
            label="Password"
            name="password"
            value={data.password}
            onChange={onChange}
            required
          />
          <Space h="md" />
          <Group position="right">
            <Button type="submit">Login</Button>
          </Group>
        </form>
      </Card>
    </Center>
  );
};

export default Login;
