import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
	"emails",
	async (job) => {
		console.log("Processing email job...");
		await new Promise((resolve) => setTimeout(resolve, 1500));
		console.log("Email job completed", job);
	},
	{ connection },
);

worker.on("completed", (job) => {
	console.log(`${job.name} job completed`);
});

worker.on("failed", (job, error) => {
	console.log(`${job.name} job failed`, error);
});
