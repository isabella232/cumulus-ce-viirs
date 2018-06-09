# SEZ-U on Cumulus

This post summarizes what I learned from configuring and deploying Cumulus to implement the [SEZ-U VIIRS Nightlights Electricity Consumption ingest and analysis](https://github.com/developmentseed/SEZ-U/tree/master/VIIRS_Nightlights).

## How To Run the SEZ-U Workflow

Start by following instructions in the [README.md](./README.md).

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
to run the discover and process workflow for _all_ months. Note, however, running this without failing also requires `ecs.volumeSize` can handle the workload of however many tasks could be running on a single ECS instance.
  * Without extensive testing, I found running 2 years worth of collections can be run safely on 3 instances - each having 150GB for Docker - running 
* Start the `GenerateCollectionsTriggerWorkflows` workflow (to be renamed as it doesn't create collections or rules)

## Why?

This project served internal and external functions:

* Internally, it helped me better understand Cumulus functionality and constraints.
* Externally, it provides an example Cumulus workflow for potential users.

Further, using the Cumulus and the cloud for the SEZ-U workflow provides the following benefits:

* Enables **performance** improvements over running on developer machines: Performance gains come from Cumulus' flavor of distributed computing scaling via Cumulus tasks (either on an ECS cluster or parallel lambda invocations) as well as a small library to download tiles in parallel ([parallel_wget](https://github.com/abarciauskas-bgse/parallel_wget)).
* **Externalizes computation and storage** from developer machines. Developer machines have more capacity for new development and results are safely stored
* **A containerized development environment** for ingest processing to docker containers and lambda functions improves re-produceability and repeatability.
* The development of **reusable components** for future workflows:

* [parallel_wget](https://github.com/abarciauskas-bgse/parallel_wget) (python package): Fetches data using wget using python's multiprocessing library
* [tif_stats](https://github.com/developmentseed/tif_stats) (python package): Generates basic stats for a tif file using geojson and gippy
* [generateCollections](https://github.com/developmentseed/cumulus-ce-viirs/tree/master/lambdas/generateCollections) (node.js lambda): Generates multiple collections using a date range defined in `event.config.collection.options`.
* [viirs_processing](https://github.com/developmentseed/viirs_processing) (python lambda function): Uses `parallel_wget`, `tif_stats` and `gippy` and stores them in S3.
* [cumulus-ecs-task-python](https://github.com/cumulus-nasa/cumulus-ecs-task-python) (docker image): Runs a python lambda on AWS ECS.
* [cumulus-geolambda](https://github.com/developmentseed/cumulus-geolambda) (docker image): Includes system to run gdal and gippy. Runs a python lambda on ECS.

## Lessons Learned

As far as existing Cumulus functionality, I better understand how to configure Cumulus workflows and how flexible the system really is to adapt to different use cases.

#### This workflow is different from "conventional" NASA DAAC workflows.

Most NASA DAAC's use Cumulus to ingest new **data as it arrives**. Our SEZ-U work uses **historical data** for its analysis. As opposed to ingesting data in "real-time", this application needed to backfill data by processing year-months past. The SEZ-U workflow includes a `generateCollections` lambda function which generates "collection"-like objects for discovering and ingesting past year-months of data.

The nice thing about the `generateCollections` lambda is meant to use a collection "template" which accepts some options so you can configure which months get collected adhoc (in case you need to re-run or run for a new month(s)).

The next step isto define this in a dynamically defined rule or dynamically define the collection so that every month the workflow runs and collects imagery for that or the past month.

#### Tile groups
Tiles need to be delivered to the viirs processing step in groups of 6 VIIRS tiles, which cover the globe. Discovery _can_ use a regex to find greater than 6 tiles at a time, my understanding is that 6 tiles need to be processed at once (althoug looking at the code not sure this understanding is correct or the stitching is working as expectied). So discovery has to either be dumb, using pre-defined url strings to find images for a given year-month or include a regex smart enough to discover and group 6 tiles. The former is implemented although the latter might be possible.

#### Using ECS

In order to run the SEZ-U processing, it was necessary to use Docker + ECS for the following reasons:

* Tile size was greater than Lambda's storage limites
* The [gippy](https://github.com/gipit/gippy) library - along with probably others or its dependencies - has system requirements for things like gdal.

The VIIRS ingest, processing and analysis is written in python. Thus was born [cumulus-ecs-task-python](https://github.com/cumulus-nasa/cumulus-ecs-task-python), child of [cumulus-ecs-task](https://github.com/cumulus-nasa/cumulus-ecs-task). And it's younger sibling, [cumulus-geolambda](https://github.com/developmentseed/cumulus-geolambda), child of `cumulus-ecs-task` and [geolambda](https://github.com/developmentseed/geolambda).

#### It's unfortunate (but logical) there is no easy way to "merge" docker images.

Of course, this doesn't really make sense, but I found that `cumulus-ecs-task-python` is fine in isolation but the requirements of viirs processing necessitated a heavier base image. So I ended up copying over all the code from `cumulus-ecs-task-python` to `cumulus-geolambda`.


## TODOs

### Priority
* **GET NEW SEZ-BOUNDARIES FILES**

### Nice to have
* Design a way to do regex discovery of lambdas (needs to pass set of 6 files to DownloadTiles).
* Design and implement automatic ingest of new data.
* Unit tests, schemas, and documentation for new packages (generateCollections, viirs_processing, tif_stats, parallel_wget, cumulus-ecs-task-python/cumulus-geolambda's run_task)
* GenerateCollections should run an arbitrary workflow (right now it's hard-coded)
* Use generate collections in another use case to validate it's extensibility + reusability
* Tif_stats could be more generic
* Validate data processing with SEZ-U team - are the tiles getting stitched together?

## Disclaimer

There is definitely one or more inefficiencies of this project, but for better or worse it was the intention not to bother others with this work given it had no immediate motivation from the company or team.
