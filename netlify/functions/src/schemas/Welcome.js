import { Schema, model } from "mongoose";
import path from path
import fs from "fs";

const defaultBackground = fs.readFileSync(
  path.join(__dirname, "../data/Background.png"),
);

const welcomeSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    welcomeMessage: {
      type: String,
      default: "Welcome to the Server!",
    },
    welcomeUseEmbed: {
      type: Boolean,
      default: false,
    },
    welcomeUseCard: {
      type: Boolean,
      default: false,
    },
    welcomeChannelId: {
      type: String,
      required: true,
    },
    welcomeBackground: {
      type: Buffer,
      default: defaultBackground,
    },
  },
  { timestamps: true },
);

export default model("Welcome", welcomeSchema);
