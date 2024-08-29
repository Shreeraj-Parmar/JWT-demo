import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "../context/MessageProvider";
import { sendLoginData } from "../services/api";

const Login = () => {
  const { setUserData } = useContext(MessageContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInpChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginClick = async () => {
    try {
      const res = await sendLoginData(loginData);
      if (res.data.accessToken && res.data.refreshToken) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUserData(loginData);
        navigate("/chat");
      } else {
        setError("Login failed: Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <p>Login here</p>
      <input
        type="text"
        name="username"
        placeholder="Enter Username"
        value={loginData.username}
        onChange={handleInpChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={loginData.password}
        onChange={handleInpChange}
      />
      <button onClick={handleLoginClick}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
