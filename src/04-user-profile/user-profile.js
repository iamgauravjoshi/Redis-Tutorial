import express from "express";
import { redis } from "../server.js";

const router = express.Router();

function getKey(id, type) {
	return `user:${id}:${type}`;
}

async function isValidKey(key) {
	const exists = await redis.exists(key);

	if (Boolean(exists)) {
		return true;
	} else {
		return false;
	}
}

// ------- USING JSON -------
router.post("/:id/json", async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "User id not provided.",
			});
		}

		const key = getKey(id, "json");

		await redis.set(key, JSON.stringify(req.body));

		return res.status(201).json({
			success: true,
			message: "User profile updated successfully.",
			method: "json",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update the user profile.",
			error: error.message,
		});
	}
});

router.get("/:id/json", async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "User id not provided.",
			});
		}

		const key = getKey(id, "json");

		const isKeyExists = await isValidKey(key);

		if (!isKeyExists) {
			return res.status(410).json({
				success: false,
				message: "User profile key not found",
			});
		}

		const user = await redis.get(key);

		return res.status(200).json({
			success: true,
			message: "User profile fetched successfully.",
			method: "json",
			data: JSON.parse(user),
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch the user profile.",
		});
	}
});

// ------- USING HASH -------
router.post("/:id/hash", async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "User id not provided.",
			});
		}

		const key = getKey(id, "hash");

		await redis.hset(key, req.body);

		return res.status(201).json({
			success: true,
			message: "User profile updated successfully.",
			method: "hash",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update the user profile.",
			error: error.message,
		});
	}
});

router.get("/:id/hash", async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "User id not provided.",
			});
		}

		const key = getKey(id, "hash");

		const isKeyExists = await isValidKey(key);

		if (!isKeyExists) {
			return res.status(410).json({
				success: false,
				message: "User profile key not found",
			});
		}

		const user = await redis.hgetall(key);

		return res.status(200).json({
			success: true,
			message: "User profile fetched successfully.",
			method: "hash",
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch the user profile.",
			error: error.message,
		});
	}
});

// ------- DELETE PROFILE -------
router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const { type } = req.query;

		const key = getKey(id, type);

		const isKeyExists = await isValidKey(key);

		if (!isKeyExists) {
			return res.status(404).json({
				success: false,
				message: "User profile key not found.",
			});
		}

		await redis.del(key);

		return res.status(200).json({
			success: true,
			message: "User profile deleted successfully.",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to delete user profile.",
			error: error.message,
		});
	}
});

export default router;
