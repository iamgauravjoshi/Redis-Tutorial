import express from "express";
import { redis } from "../server.js";

const router = express.Router();

function otpKey(phone) {
	return `otp:${phone}`;
}

router.post("/", async (req, res, next) => {
	try {
		const { phone } = req.body;

		if (!phone) {
			return res.status(400).json({
				success: false,
				message: "Phone number is required.",
			});
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		await redis.set(otpKey(phone), otp, "EX", 30); // OTP valid for only 30 sec

		return res.status(201).json({
			success: true,
			otp: otp,
			message: "OTP sent successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to send the OTP",
			error: error.message,
		});
	}
});

router.post("/verify", async (req, res, next) => {
	try {
		const { phone, otp } = req.body;

		if (!phone || !otp) {
			return res.status(400).json({
				success: false,
				message: "Phone number and OTP are required.",
			});
		}

		const savedOtp = await await redis.get(otpKey(phone));

		if (!savedOtp) {
			return res.status(410).json({
				success: false,
				message: "OTP has expired.",
			});
		}

		if (savedOtp !== otp) {
			return res.status(401).json({ success: false, message: "Invalid OTP." });
		}

		return res.status(200).json({
			success: true,
			message: "OTP verified successfully.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to verify the OTP",
			error: error.message,
		});
	}
});

router.get("/:phone/ttl", async (req, res, next) => {
	try {
		const { phone } = req.params;

		const ttl = await redis.ttl(otpKey(phone));

		return res.status(200).json({
			success: true,
			message: ttl === -2 ? "The key does not exist." : ttl,
			ttl: ttl,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error while checking TTL",
			error: error.message,
		});
	}
});

router.delete("/", async (req, res, next) => {
	try {
		const { phone } = req.query;

		if (!phone) {
			return res.status(400).json({
				success: false,
				message: "Phone number is required.",
			});
		}

		const exists = await redis.exists(otpKey(phone));

		if (Boolean(exists)) {
			await redis.del(otpKey(phone));

			return res.status(200).json({
				success: true,
				message: "OTP deleted successfully",
			});
		} else {
			return res.status(404).json({
				success: false,
				message: "No OTP key found.",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error while deleting OTP",
			error: error.message,
		});
	}
});

export default router;
