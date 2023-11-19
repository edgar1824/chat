import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    conversationId: { type: String, required: true, ref: "Conversation" },
    sender: { type: String, required: true },
    text: { type: String },
    audio: { type: String },
    device: { type: String, enum: ["PC", "Mobile"], default: "PC" },
    watched: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] },
}, { timestamps: true });
export default mongoose.model("Message", MessageSchema);
//# sourceMappingURL=Message.js.map