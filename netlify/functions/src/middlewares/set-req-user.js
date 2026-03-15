import User from "../schemas/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const token = cookies?.token;
    if (!token) {
      console.log("[auth] no token cookie present");
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[auth] token decoded", {
      userId: decodedToken?.userId,
      username: decodedToken?.username,
    });

    if (decodedToken?.userId) {
      const targetUser = await User.findOne({
        userId: decodedToken.userId,
      }).lean();

      if (targetUser) {
        req.user = targetUser;
      } else {
        console.log("[auth] no user found for token userId");
      }
    }
  } catch (error) {
    console.error("JWT Middleware Error:", error.message);
  }
  next();
};
