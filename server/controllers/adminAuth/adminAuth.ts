import { Request, Response } from "express";
import JWT from "jsonwebtoken";

async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Missing environment variables.");
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = JWT.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
}

export { loginAdmin };
