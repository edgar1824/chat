import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID ||
        "206289355894-t4bd0vt2o5rd0p4sjh4p822pnpoicfv7.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ||
        "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",
    callbackURL: "/api/auth/google/callback",
}, function (accessToken, refreshToken, profile, done) {
    done(null, profile);
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
//# sourceMappingURL=passport-setup.js.map