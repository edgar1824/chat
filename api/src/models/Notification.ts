import mongoose, { Schema, Types } from "mongoose";

export interface INotification {
  type: string;
  recievers: Types.ObjectId[];
  title: string;
  sender: Types.ObjectId;
  text: string;
  expireAt: string | Date;
}

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["be-friend", "friend-removed", "friend-added"],
      default: "be-friend",
    },
    recievers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    title: String,
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true },
    expireAt: {
      type: Date,
      default: Date.now(),
      expires: 0,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
