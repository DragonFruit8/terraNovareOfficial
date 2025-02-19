export const checkEmailVerified = async (req, res, next) => {
    const user = await sql`SELECT * FROM users WHERE user_id = ${req.user.id}`;
    if (!user[0].email_verified) {
      return res.status(403).json({ error: "Please verify your email first!" });
    }
    next();
  };