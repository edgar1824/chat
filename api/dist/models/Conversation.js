import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema({
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
    img: String,
    title: mongoose.Schema.Types.Mixed,
    admins: { type: [mongoose.Schema.Types.ObjectId] },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
}, { timestamps: true });
export default mongoose.model("Conversation", ConversationSchema);
//# sourceMappingURL=Conversation.js.map