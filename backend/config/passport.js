import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import sql from "../db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await sql`SELECT * FROM users WHERE google_id = ${profile.id}`;

        if (user.length === 0) {
          const generatedUsername = profile.displayName
            ? profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(1000 + Math.random() * 9000)
            : "user" + Math.floor(100000 + Math.random() * 900000); // Generate random username if missing

          user = await sql`
            INSERT INTO users (fullname, email, google_id, username)
            VALUES (${profile.displayName || "Google User"}, ${profile.emails[0].value}, ${profile.id}, ${generatedUsername})
            RETURNING *;
          `;
        }
        return done(null, newUser[0]);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await sql`SELECT * FROM users WHERE user_id = ${id}`;
    done(null, user[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
