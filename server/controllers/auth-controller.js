import User from "../models/user.js";
import Message from "../models/messge.js";
import jwt from "jsonwebtoken";

// Utility function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ user: user.id }, "process.env.JWT_SECRET", {
    expiresIn: "15m", // Adjust expiration as needed
  });
  const refreshToken = jwt.sign(
    { user: user.id },
    "process.env.JWT_REFRESH_SECRET",
    {
      expiresIn: "7d", // Adjust expiration as needed
    }
  );
  return { accessToken, refreshToken };
};

// Signup
export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username: username });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      password,
    });

    await user.save();
    console.log("User saved");

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body);

  try {
    let user = await User.findOne({ username: username });
    // console.log(user);
    if (user.username === username && user.password === password) {
      const tokens = generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
        message: "Login successful",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Send all messages
export const sendAllMessage = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({ messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get message
// Get message
export const getMessage = async (req, res) => {
  const { content } = req.body; // Extract content from request body
  console.log("content is :", content);
  console.log("user isd is ", req.user);

  // if (!content || !req.user || !req.user.id) {
  //   console.log("error is this side");
  //   return res.status(400).json({ message: "Content or user ID is missing" });
  // }

  try {
    const newMessage = new Message({
      content: content,
      user: req.user, // Attach the user ID from the request
    });

    let re = await newMessage.save();
    console.log(re);
    res.status(200).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Refresh token not found, login again" });
  }

  try {
    const payload = jwt.verify(refreshToken, "process.env.JWT_REFRESH_SECRET");

    let user = await User.findById(payload.user.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { user: { id: user.id } },
      "process.env.JWT_SECRET",
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Logout
export const logout = async (req, res) => {
  const { userId } = req.body;

  try {
    let user = await User.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};
