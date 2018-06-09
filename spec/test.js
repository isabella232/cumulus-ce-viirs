const { buildAndExecuteWorkflow, LambdaStep } = require('@cumulus/integration-tests');

const { loadConfig } = require('./helpers/testUtils');

const config = loadConfig();
const lambdaStep = new LambdaStep();

const taskName = 'GenerateCollectionsTriggerWorkflows';
let workflowExecution;

async function startWf() {
  const collection = { name: 'viirs_template', version: '001' };
  const provider = { id: 'viirs_provider' };

  workflowExecution = await buildAndExecuteWorkflow(
    config.stackName,
    config.bucket,
    taskName,
    collection,
    provider
  );
};

startWf();
console.log(JSON.stringify(workflowExecution, null, 2));
