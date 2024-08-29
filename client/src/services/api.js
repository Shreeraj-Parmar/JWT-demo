import axios from "axios";

const URL = "http://localhost:8000";

// For login
export const sendLoginData = async (data) => {
  try {
    let response = await axios.post(`${URL}/login`, data);
    return response;
  } catch (error) {
    console.log("Error during sendLoginData:", error.message);
  }
};

// For signup
export const sendSignUpData = async (data) => {
  try {
    let response = await axios.post(`${URL}/signup`, data);
    return response;
  } catch (error) {
    console.log("Error during sendSignUpData:", error.message);
  }
};

// Get all messages
export const getAllMessages = async () => {
  try {
    let response = await axios.post(
      `${URL}/message/get`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error during getAllMessages:", error.message);
  }
};

// Send a message
export const sendMessage = async (data) => {
  try {
    const token = localStorage.getItem("token");
    let response = await axios.post(`${URL}/message`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Error during sendMessage:", error.message);
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${URL}/refresh-token`, { refreshToken });
    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    return accessToken;
  } catch (error) {
    console.log("Error refreshing access token:", error.message);
    return null;
  }
};

// Logout
export const logout = async () => {
  try {
    await axios.post(
      `${URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.log("Error during logout:", error.message);
  }
};
