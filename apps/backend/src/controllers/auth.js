const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ok, error, unauthorized, serverError } = require("../response");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return error(res, "VALIDATION_ERROR", "email and password are required");

    const user = await User.findByEmail(email);
    if (!user) return unauthorized(res, "Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return unauthorized(res, "Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return ok(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        is_admin: user.is_admin,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    return serverError(res, err);
  }
};

// Stateless JWT — client just drops the token.
// Endpoint exists for API consistency.
const logout = (_req, res) => ok(res, { message: "Logged out" });

module.exports = { login, logout };
