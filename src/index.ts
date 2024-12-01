import bodyParser from "body-parser";
import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
// import submissionQueueProducer from "./producers/submissionQueueProducer";
import apiRouter from "./routes";
import { submission_queue } from "./utils/constants";
import SampleWorker from "./workers/SampleWorker";
import SubmissionWorker from "./workers/SubmissionWorker";
// import runJava from "./containers/runJavaDocker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);
app.use("/ui", bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);
  console.log(
    `BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`
  );

  SampleWorker("SampleQueue");
  SubmissionWorker(submission_queue);

  //   const code = `x = input()
  // y = input()
  // print("value of a is", x)
  // print("value of b is", y)
  // `;
  // const userCode = `
  //   class Solution{
  //    public int num(){
  //      return 20;
  //    }
  //   }
  // `;
  // const code = `
  // import java.util.*;
  // ${userCode}
  // public class Main{
  //   public static void main(String[] args){
  //     Solution obj = new Solution();
  //     System.out.println(obj.num());
  //   }
  // }
  // `;

  // const code = `
  // #include <iostream>
  // using namespace std;

  // int main(){

  //   int x;
  //   cin>>x;
  //   cout<<"Value of x is "<<x<<endl;
  //   for(int i=0;i<x;i++){
  //     cout<<i<<" ";
  //   }
  //   return 0;

  // }
  // `;
  //   const code = `
  //    #include<iostream>
  //    using namespace std;

  //    int main(){

  //     int x;
  //     cin>>x;
  //     cout<<"Value of x is "<<x<<endl;
  //     for(int i=0;i<x;i++){
  //       cout<<i<<" ";
  //     }
  //     return 0;
  //    }
  // `;
  // const inputCase = `10
  // `;
  // runCpp(code, inputCase);

  // runPython(code, inputCase);
  // runJava(code, inputCase);
  // submissionQueueProducer({
  //   "1234": {
  //     language: "JAVA",
  //     inputCase,
  //     code,
  //   },
  // });
});
