import React, { useState, useEffect, useContext } from "react";
import { MessageContext } from "../context/MessageProvider";

import { useNavigate } from "react-router-dom";

import {
  getAllMessages,
  sendMessage,
  refreshAccessToken,
  logout,
} from "../services/api";

const Chat = () => {
  const { userData, setUserData } = useContext(MessageContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  // Function to fetch all messages
  const fetchMessages = async () => {
    try {
      const data = await getAllMessages();
      console.log(data.messages);
      setChats(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      setError("Error fetching messages");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  // Function to send a new message
  const handleSendMessage = async () => {
    try {
      await sendMessage({ content: newMessage });
      setNewMessage(""); // Clear the input field
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Error sending message:", error.message);
      setError("Error sending message");
    }
  };

  // Function to handle token refresh
  const handleTokenRefresh = async () => {
    const newToken = await refreshAccessToken();
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      setUserData(null);
      navigate("/login");
      // Clear user data if refreshing token fails
      // Redirect to login page or show an error message
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null); // Clear user data
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
      setError("Error during logout");
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch messages on component mount

    // Set up a token refresh interval
    const refreshInterval = setInterval(() => {
      handleTokenRefresh();
    }, 15 * 60 * 1000); // Refresh token every 15 minutes

    return () => clearInterval(refreshInterval); // Clean up on component unmount
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <div className="messages">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((msg, index) => <li key={index}>{msg.content}</li>)
          ) : (
            <p>No chats available</p>
          )}
        </div>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
