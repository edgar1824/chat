import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
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
}, { timestamps: true });
export default mongoose.model("Post", PostSchema);
//# sourceMappingURL=Post.js.map