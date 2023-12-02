import mongoose, { Types } from "mongoose";

export interface IConversation {
  _id: Types.ObjectId;
  members: Types.ObjectId[];
  type: "group" | "dialogue";
  img: string | [string, string];
  title: string | string[];
  admins: Types.ObjectId[];
  lastMessage: Types.ObjectId;
}

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    type: {
      type: String,
      enum: ["group", "dialogue"],
      default: "dialogue",
      required: true,
    },
    img: mongoose.Schema.Types.Mixed,
    title: mongoose.Schema.Types.Mixed,
    admins: { type: [mongoose.Schema.Types.ObjectId] },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
