import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    sent: { type: Boolean },
    fcmTokens: [{ type: String }],
    localtime: [{ type: String }],
    timezone: [{ type: String }],
    time: { type: String },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model(
  "NOTIFICATION",
  NotificationSchema
);
