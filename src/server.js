import { Redis } from "ioredis";
import express from "express";
import dotenv from "dotenv";
import siteBannerRoutes from "./02-site-banner/site-banner.js";
import otpVerificationRoutes from "./03-otp-with-ttl/otp-with-ttl.js";
import userProfileRoutes from "./04-user-profile/user-profile.js";
import emailQueueRoutes from "./05-email-queue/email-queue.js";

const port = process.env.PORT || 3000;

const app = express();
dotenv.config();

export const redis = new Redis(
	process.env.REDIS_URL || "redis://localhost:6379",
);

app.use(express.json());

// ------- Site Banner -------
app.use("/banner", siteBannerRoutes);

// ------- OTP with TTL -------
app.use("/otp", otpVerificationRoutes);

// ------- User Profile -------
app.use("/user", userProfileRoutes);

// ------- Email Queue with Redis list -------
app.use("/emails", emailQueueRoutes);

app.get("/", async (req, res) => {
	return res.status(200).json({ success: true, message: "Server is running" });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
