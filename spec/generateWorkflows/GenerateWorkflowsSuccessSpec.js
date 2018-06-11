const { buildAndExecuteWorkflow, LambdaStep } = require('@cumulus/integration-tests');

const { loadConfig } = require('../helpers/testUtils');

const config = loadConfig();
const lambdaStep = new LambdaStep();

const taskName = 'GenerateCollectionsTriggerWorkflows';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000;

describe('The GenerateCollectionsTriggerWorkflows workflow', () => {
  let workflowExecution;

  beforeAll(async () => {
    const collection = { name: 'viirs_template', version: '001' };
    const provider = { id: 'viirs_provider' };

    workflowExecution = await buildAndExecuteWorkflow(
      config.stackName,
      config.bucket,
      taskName,
      collection,
      provider
    );
  });

  it('executes successfully', () => {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe('the DiscoverGranules Lambda', () => {
    let lambdaOutput = null;

    beforeAll(async () => {
      lambdaOutput = await lambdaStep.getStepOutput(
        workflowExecution.executionArn,
        'GenerateCollections'
      );
    });

    it('has expected granules output', () => {
      expect(lambdaOutput.payload.message).toMatch(/Scheduled \d+ workflows/);
    });
  });
});
