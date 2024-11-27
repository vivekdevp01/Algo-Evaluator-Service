// import runJava from "../containers/runJavaDocker";
import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import { executionResponse } from "../types/CodeEvaluatorStrategy";
import createExectutor from "../utils/ExecutorFactory";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of the job called");
    console.log(this.payload);
    if (job) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const inputCase = this.payload[key].inputCase;
      const strategy = createExectutor(codeLanguage);
      if (strategy != null) {
        const response: executionResponse = await strategy.execute(
          code,
          inputCase
        );
        if (response.status === "COMPLETED") {
          console.log("code executed successfully", response);
        } else {
          console.log("error executing code", response);
        }
      }
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
