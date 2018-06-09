#  Cumulus Community Edition Examples: VIIRS Workflow

This is an example project using Cumulus Community Edition.

## What is Cumulus?

Cumulus is a cloud-based data ingest, archive, distribution and management
prototype for NASA's future Earth science data streams.

Read the [Cumulus Documentation](https://cumulus-nasa.github.io/)

## Installation

Pre-requisits

* node, nvm

```bash
git clone https://github.com/developmentseed/cumulus-ce-viirs.git
cd cumulus-ce-viirs
nvm use
npm install
# If running viirs processing workflow
npm run viirs
npm run build-generate-collections
```

## How to configure your stack

Follow instructions in the [deployment guide](https://cumulus-nasa.github.io/docs/deployment.html).

### Important Notes:
* Skip _Linux/MacOS software requirements_
* Skip anything having to do with CMR and EarthData login (you need CMR credentials in you `app/.env` but they can be invalid since this workflow doesn't make requests to CMR)
* Your default AWS credentials should be the same credentials used for the deployment.
* Skip _Make local copy of Cumulus Repo and prepare it._
* This repo is the equivalent of your "template-deploy" or "DAAC deployment repository"
* Dashboard is not necessary for the workflow to work, but may help if you prefer a dashboard interface.
* This repo is configured to use google oauth for authentication, so your `app/config.yml` should use a valid google email address you can use to login to the dashboard.

## Troubleshooting

**Error:** `distutils.errors.DistutilsOptionError: must supply either home or prefix/exec-prefix -- not both` when running `npm run viirs`
**Solution:** https://stackoverflow.com/questions/24257803/distutilsoptionerror-must-supply-either-home-or-prefix-exec-prefix-not-both

