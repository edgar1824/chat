import mongoose, { Types } from "mongoose";

export interface IUser {
  googleId: string;
  username: string;
  email: string;
  country: string;
  img: string;
  city: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  friends: (Types.ObjectId | string)[];
}

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String },
    img: { type: String },
    city: { type: String },
    phone: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    friends: {
      type: [{ type: String, ref: "User" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
