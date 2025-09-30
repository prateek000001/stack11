import express from 'express';
import { google, signin, signOut, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signOut);

// Protected route to get current user
router.get("/profile", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
