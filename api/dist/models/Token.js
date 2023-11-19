import mongoose from "mongoose";
const TokenSchema = new mongoose.Schema({
    userId: { type: String, ref: "User", requird: true },
    token: { type: String, requird: true },
});
export default mongoose.model("Token", TokenSchema);
//# sourceMappingURL=Token.js.map