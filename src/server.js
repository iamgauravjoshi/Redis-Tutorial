import { Redis } from "ioredis";
import express from "express";
import dotenv from "dotenv";
import siteBannerRoutes from "./02-site-banner/site-banner.js";
import otpVerificationRoutes from "./03-otp-with-ttl/otp-with-ttl.js";

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

app.get("/", async (req, res) => {
	return res.status(200).json({ success: true, message: "Server is running" });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

// router.post("/otp", async (req, res, next) => {
// 	try {
// 		const { phone } = req.body;
// 		const otp = Math.floor(100000 + Math.random() * 900000).toString();

// 		if (!phone) {
// 			res
// 				.status(404)
// 				.json({ succes: false, message: "Phone number not found" });
// 		}

// 		await redis.set(otpKey(phone), otp, "EX", 30); // OTP valid only for 30 sec
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: "Failed to send the OTP" });
// 	}
// });
