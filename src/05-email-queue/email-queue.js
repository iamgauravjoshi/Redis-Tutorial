import express from "express";
import { redis } from "../server.js";

const router = express.Router();

const QUEUE_KEY = "queue:emails";

router.post("/", async (req, res, next) => {
	try {
		const { to, subject, body } = req.body;
		const job = {
			to: to,
			subject: subject ?? "No subject",
			body: body ?? "No content",
			createdAt: new Date().toISOString(),
		};

		await redis.lpush(QUEUE_KEY, JSON.stringify(job));

		return res.status(200).json({
			success: true,
			message: "Email queued to redis successfully.",
			data: job,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to queue email.",
			error: error.message,
		});
	}
});

router.get("/process-one", async (req, res, next) => {
	try {
		const rawJob = await redis.rpop(QUEUE_KEY);

		if (!rawJob) {
			return res.status(400).json({
				success: false,
				message: "No jobs found in the email queue.",
			});
		}

		const job = JSON.parse(rawJob);

		return res.status(200).json({
			success: true,
			message: "Email simulated successfully from queue.",
			data: job,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to process email queue job.",
			error: error.message,
		});
	}
});

export default router;
