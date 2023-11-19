import mongoose, { Types } from "mongoose";

export interface IPost {
  user: Types.ObjectId;
  desc: string;
  watched: Types.ObjectId[];
  likes: Types.ObjectId[];
  img: string;
}

const PostSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true },
    desc: { type: String },
    watched: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    img: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
