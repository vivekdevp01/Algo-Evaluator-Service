import javaExecutor from "../containers/runJavaDocker";
import PythonExecutor from "../containers/runPythonDocker";
import CodeEvaluatorStrategy from "../types/CodeEvaluatorStrategy";

export default function createExectutor(
  codeLanguage: string
): CodeEvaluatorStrategy | null {
  if (codeLanguage === "JAVA") {
    return new javaExecutor();
  } else if (codeLanguage === "PYTHON") {
    return new PythonExecutor();
  } else {
    return null;
  }
}
