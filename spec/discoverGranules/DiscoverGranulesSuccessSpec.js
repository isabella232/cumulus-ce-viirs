const { buildAndExecuteWorkflow, LambdaStep } = require('@cumulus/integration-tests');

const { loadConfig } = require('../helpers/testUtils');

const config = loadConfig();
const lambdaStep = new LambdaStep();

const taskName = 'DiscoverAndQueueGranules';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000;

describe('The Discover and Queue Granules workflow', () => {
  let httpWorkflowExecution;

  beforeAll(async () => {
    const collection = { name: 'viirs', version: '001' };
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
        'DiscoverGranules'
      );
    });

    it('has expected granules output', () => {
      expect(lambdaOutput.payload.granules.length).toEqual(6);
      //expect(lambdaOutput.payload.granules[0].granuleId).toEqual('granule-1');
      //expect(lambdaOutput.payload.granules[0].files.length).toEqual(2);
    });
  });
});
