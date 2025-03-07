import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../config/db.js";
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
        let user = await pool.query(
          `SELECT * FROM users WHERE google_id = $1`, 
          [profile.id]
        );

        if (user.rows.length === 0) {
          const generatedUsername = profile.displayName
            ? profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(1000 + Math.random() * 9000)
            : "user" + Math.floor(100000 + Math.random() * 900000);

          user = await pool.query(
            `INSERT INTO users (fullname, email, google_id, username)
             VALUES ($1, $2, $3, $4)
             RETURNING *;`,
            [
              profile.displayName,
              profile.emails[0].value,
              profile.id,
              generatedUsername
            ]
          );
        }
        return done(null, user.rows[0]);
      } catch (error) {
        logger.error("Google OAuth Error:", error);
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
    const user = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});


export default passport;
