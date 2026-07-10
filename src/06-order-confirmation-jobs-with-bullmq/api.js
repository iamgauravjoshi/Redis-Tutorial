import express from "express";
import { emailQueue } from "./queue.js";
import { delay } from "bullmq";

const router = express.Router();

router.post("/welcome-email", async (req, res, next) => {
	try {
		const { to, name } = req.body;

		if (!to || !name) {
			return res.status(400).json({
				success: true,
				message: "Name and recipient is required.",
			});
		}

		const job = emailQueue.add(
			"send-welcome-email",
			{
				to: req.body.to,
				name: req.body.name,
			},
			{
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 1000,
				},
			},
		);

		return res.status(200).json({
			success: true,
			message: "Welcome email job added to the queue",
			data: job,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to add email job to the queue",
			data: error,
		});
	}
});

export default router;
