import { Schema, model } from "mongoose";
import path from path
import fs from "fs";

const defaultBackground = fs.readFileSync(
  path.join(__dirname, "../data/TestBackground.png"),
);
const levelSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    levelupMessage: {
      type: String,
      default: "Du bist ein Level aufgestiegen!",
    },
    levelUseCard: {
      type: Boolean,
      default: false,
    },
    levelUpChannelId: {
      type: String,
      required: true,
    },
    levelLeaderbordsChannelId: {
      type: String,
      required: true,
    },
    levelLeaderboardMessageId: {
      type: String,
      default: null,
    },
    levelBackground: {
      type: Buffer,
      default: defaultBackground,
    },
  },
  { timestamps: true },
);

export default model("Level", levelSchema);
