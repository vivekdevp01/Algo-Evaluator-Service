// import Dockerode from "dockerode";
import CodeEvaluatorStrategy, {
  executionResponse,
} from "../types/CodeEvaluatorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class javaExecutor implements CodeEvaluatorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputCase: string
  ): Promise<executionResponse> {
    console.log(code, inputTestCase, outputCase);
    const rawLogBuffer: Buffer[] = [];

    console.log("Initialising a new python docker container");
    await pullImage(JAVA_IMAGE);
    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > Main.java && javac Main.java  && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | java Main`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);

    // starting / booting the corresponding docker container
    await javaDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await javaDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streamed or returned as a string
    });

    // Attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });
    try {
      const codeResponse: string = await this.fetchCodeResponse(
        loggerStream,
        rawLogBuffer
      );
      if (codeResponse.trim() === outputCase.trim()) {
        return { output: codeResponse, status: "SUCCESS" };
      } else {
        return { output: codeResponse, status: "WA" };
      }
      // return { output: codeResponse, status: "COMPLETED" };
    } catch (error) {
      console.log("error occured,", error);
      if (error === "TLE") {
        await javaDockerContainer.kill();
      }
      return { output: error as string, status: "ERROR" };
    } finally {
      await javaDockerContainer.remove();
    }
  }
  fetchCodeResponse(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[]
  ): Promise<string> {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        console.log("TimeOut called");
        rej("TLE");
      }, 2000);
      loggerStream.on("end", () => {
        clearTimeout(timeout);
        console.log(rawLogBuffer);

        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        console.log(decodedStream.stdout);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default javaExecutor;
