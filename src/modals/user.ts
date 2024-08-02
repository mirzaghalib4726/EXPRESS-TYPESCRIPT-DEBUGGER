import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    fcmToken: {
      type: String,
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("USER", UserSchema);
