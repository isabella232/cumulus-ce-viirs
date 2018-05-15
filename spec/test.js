const { buildAndExecuteWorkflow, LambdaStep } = require('@cumulus/integration-tests');

const { loadConfig } = require('./helpers/testUtils');

const config = loadConfig();
const lambdaStep = new LambdaStep();

const taskName = 'DownloadTiles';
let workflowExecution;

async function startWf() {
  workflowExecution = await buildAndExecuteWorkflow(
    config.stackName,
    config.bucket,
    taskName
  );
};

startWf();
console.log(JSON.stringify(workflowExecution, null, 2));
