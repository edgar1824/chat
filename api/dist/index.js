import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/auth.js";
import conversationsRouter from "./routes/conversations.js";
import messagesRouter from "./routes/messages.js";
import notificationsRouter from "./routes/notifications.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { accessControlConfig, convertToObj, errorBoundary, fileUploading, } from "./middlewares/index.js";
import "./config/passport-setup.js";
import { turnOnSocket } from "./config/socket.js";
import { connectDB } from "./config/db.js";
const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
console.log(__dirname);
// ===========================================
// ===========================================
dotenv.config();
const app = express();
// Middlewares
// app.use("/public", express.static(path.join(__dirname, "/public")));
// app.use("/", express.static(path.join(__dirname, "../../client/build")));
app.use(accessControlConfig);
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(fileUpload({ defCharset: "utf8", defParamCharset: "utf8" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUploading);
app.use(convertToObj);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// API
app.get("/test", (req, res) => {
    res.send("test");
});
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/posts", postsRouter);
app.get("/public/:filename", (req, res, next) => {
    try {
        res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.sendFile(path.join(__dirname, "/public", req.params.filename));
        console.log(path.join(__dirname, "/public", req.params.filename));
    }
    catch (err) {
        next(err);
    }
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});
app.use(errorBoundary);
//
//
//
app.listen(process.env.PORT, () => {
    console.log("Server started!");
    turnOnSocket().on("response", () => {
        console.log("Socket Turned ON!!!");
        connectDB().then(() => {
            const models = [
            // Message,
            // Conversation,
            // User,
            // Token,
            // Notification,
            ];
            !!models?.length &&
                models.forEach((Model) => {
                    Model?.deleteMany()
                        .then(() => console.log(200))
                        .catch((err) => console.log(err));
                });
        });
    });
});
//# sourceMappingURL=index.js.map