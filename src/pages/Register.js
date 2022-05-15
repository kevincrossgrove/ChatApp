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
import axios from "axios";
import React from "react";
import UserContext from "../UserContext";

const initialData = {
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [data, setData] = React.useState(initialData);
  const { setUser } = React.useContext(UserContext);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/", data);
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Center style={{ width: "100vw", height: "100vh" }}>
      <Card style={{ minWidth: 350, maxWidth: 550, width: "100%" }}>
        <Title order={3}>Create Account</Title>
        <Space h="md" />
        <form onSubmit={createAccount}>
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
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={onChange}
            required
          />
          <Space h="md" />
          <Group position="right">
            <Button type="submit">Create Account</Button>
          </Group>
        </form>
      </Card>
    </Center>
  );
};

export default Register;
