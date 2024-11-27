import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";
// import SampleJob from "../jobs/SampleJob";

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log("Submission job worker kicking", job);
      if (job.name === "SubmissionJob") {
        const submissionJobInstance = new SubmissionJob(job.data);

        submissionJobInstance.handle(job);

        return true;
      }
    },
    {
      connection: redisConnection,
    }
  );
}
