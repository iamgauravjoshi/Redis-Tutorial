import express from "express";
import dotenv from "dotenv";
import { redis } from "../server.js";

const BANNER_KEY = "app:banner";

const router = express.Router();

router.get("/exists", async (req, res, next) => {
	try {
		const exists = await redis.exists(BANNER_KEY);
		return res.status(200).json({ exists: Boolean(exists), message: exists });
	} catch (error) {
		res.status(500).json({ success: false, message: "Banner key not found" });
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { message } = req.body;

		if (!message) {
			return res.status(400).json({
				success: false,
				message: "Message is required.",
			});
		}

		await redis.set(BANNER_KEY, message);

		return res.status(200).json({
			success: true,
			message: "Banner message sent successfully.",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to save banner." });
	}
});

router.get("/", async (req, res, next) => {
	try {
		const message = await redis.get(BANNER_KEY);

		if (message === null) {
			return res.status(404).json({
				success: false,
				message: "Banner not found.",
			});
		}

		return res.status(200).json({
			success: true,
			message,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to get banner." });
	}
});

router.delete("/", async (req, res, next) => {
	try {
		const exists = await redis.exists(BANNER_KEY);

		if (Boolean(exists)) {
			await redis.del(BANNER_KEY);

			return res.status(200).json({
				success: true,
				message: "Banner deleted successfully.",
			});
		} else {
			return res.status(404).json({
				success: false,
				message: "Banner not found.",
			});
		}
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "Failed to delete banner." });
	}
});

export default router;
