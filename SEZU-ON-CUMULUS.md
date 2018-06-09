# SEZ-U on Cumulus

## How To

See the [README.md](./README.md)

Running the workflow:
* Update the collection `viirs_template` definition to include months of interest. For example, you could have:
```json
// data/viirs-collection.json
{
  // ... ,
  "options": {
    "spanUnit": "month",
    "spanStart": "201201",
    "spanEnd": "201805"
  }
}
```
to run the discover and process workflow for _all_ months. Of course, how fast this runs depends on the configuration of your cluster.
* Start the `GenerateCollectionsAndRules` workflow (to be renamed as it doesn't create collections or rules)

## Why

This project served an internal and external function:

* Internally, it helped me better understand Cumulus functionality and constraints
* Externally, it provides an example Cumulus workflow for potential users.

Further, using the cloud for the SEZ-U workflow provides the following benefits:

* Enables performance improvements via Cumulus' flavor of distributing computing scaling via Cumulus tasks (either on an ECS cluster or parallel lambda invocations).
* Externalizes computation from developer machines, freeing those machines for new workflow development.
* Externalizes storage of results, for other development or visualization.
* Externalizes the development environment for ingest processing to docker containers and lambda functions, improving re-produceability and repeatability.

## What I learned

As far as existing Cumulus functionality, I better understand how to configure Cumulus workflows and how flexible the system really is to adapt to different use cases.

However, this workflow turned out to be quite different from "conventional" NASA DAAC workflows.

* It is mostly a "backfill" application. Most NASA DAAC's are intending to use Cumulus to ingest new data as it arrives. SEZ-U is a historical trend analysis - as opposed to "real-time" ingest and process. The result is that the SEZ-U workflow includes a "GenerateCollections" lambda function which generates "collection"-like objects used to start the discover granules workflow.
* Tiles need to be delivered for processing in groups of 6 VIIRS tiles. So discovery has to either be dumb and just find images for a defined year-month or smart enough to determine which discovered tiles need to be grouped toghether. I went with the former.
* The nice thing about the generateCollections is it works off a collection "template" which accepts some options so you can configure which months get collected adhoc (in case you need to re-run or run for a new month(s)).
* Next step would be to define this in a dynamically defined rule or dynamically define the collection so that every month the workflow runs and collects imagery for that or the past month.



