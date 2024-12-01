export default interface CodeEvaluatorStrategy {
  execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<executionResponse>;
}
export type executionResponse = {
  output: string;
  status: string;
};
