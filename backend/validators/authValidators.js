// backend/validators/authSchemas.js
const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema
};
