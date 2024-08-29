import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MessageContext } from "../context/MessageProvider";
import { sendSignUpData } from "../services/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({ username: "", password: "" });
  const { setUserData } = useContext(MessageContext);

  const handleInpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignUpClick = async () => {
    try {
      const res = await sendSignUpData(signUpData);
      if (res.data.accessToken && res.data.refreshToken) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUserData(signUpData);
        navigate("/chat");
      } else {
        console.log("Signup failed");
      }
    } catch (error) {
      console.log("Error during signup:", error.message);
    }
  };

  return (
    <div>
      <p>SignUp here</p>
      <input
        type="text"
        name="username"
        placeholder="Enter Username"
        value={signUpData.username}
        onChange={handleInpChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={signUpData.password}
        onChange={handleInpChange}
      />
      <button onClick={handleSignUpClick}>SignUp</button>
    </div>
  );
};

export default SignUp;
