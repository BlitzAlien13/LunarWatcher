import User from "../schemas/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const token = cookies?.token;
    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken?.userId) {
      const targetUser = await User.findOne({
        userId: decodedToken.userId,
      }).lean();

      if (targetUser) req.user = targetUser;
    }
  } catch (error) {
    console.error("JWT Middleware Error:", error.message);
  }
  next();
};
