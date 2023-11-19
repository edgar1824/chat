import mongoose, { Types } from "mongoose";

export interface IToken {
  userId: Types.ObjectId;
  token: string;
}

const TokenSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", requird: true },
  token: { type: String, requird: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);
