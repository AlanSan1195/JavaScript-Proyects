

//  trabajando con web Worker 
// https://github.com/mlc-ai/web-llm/tree/main 

import { WebWorkerMLCEngineHandler } from "https://esm.run/@mlc-ai/web-llm";

const worker = new WebWorkerMLCEngineHandler();

onmessage = e => {
    worker.onmessage(e);

}
