import jwt from "jsonwebtoken";

const authMiddle = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "process.env.JWT_SECRET"); // Verify the token
    console.log(decoded);
    req.user = decoded.user; // Attach the user to the request object
    console.log("user is", req.user);
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddle;
