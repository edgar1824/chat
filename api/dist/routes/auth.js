import express from "express";
import passport from "passport";
import AuthController from "../controllers/AuthController.js";
import { createError } from "../helpers/createError.js";
const router = express.Router();
// REGISTER
router.post("/register", AuthController.register);
// LOGIN
router.post("/login", AuthController.login);
// LOGOUT
router.get("/logout", AuthController.logout);
// REFRESH TOKEN
router.get("/refresh", AuthController.refresh);
// GOOGLE AUTHENTIFICATION
// ---------------------------------------------
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    // successRedirect: path.join(CLIENT_URL, "auth/login/google"),
    successRedirect: "/auth/login/google",
    failureRedirect: "/api/auth/google/failed",
}));
// ======================================
router.get("/google/failed", (req, res, next) => {
    next(createError(401, "google account error"));
});
router.get("/google/success", AuthController.registerByGoogle);
// ======================================
export default router;
//# sourceMappingURL=auth.js.map