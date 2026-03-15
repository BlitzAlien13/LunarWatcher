import { Schema, model } from "mongoose";

const guildSchema = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    iconHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default model("Guild", guildSchema);
