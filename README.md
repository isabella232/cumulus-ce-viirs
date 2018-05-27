#  Cumulus Community Edition Examples: VIIRS Workflow

This is an example project using Cumulus Community Edition.

## What is Cumulus?

Cumulus is a cloud-based data ingest, archive, distribution and management
prototype for NASA's future Earth science data streams.

Read the [Cumulus Documentation](https://cumulus-nasa.github.io/)

## Installation

```bash
nvm use
npm install
# If running viirs processing workflow
npm run viirs
```

### How to configure your stack

Your default AWS credentials should be the same credentials used for the deployment.

To use a different stack name, update `app/config.yml` and `iam/config.yml`.


## Troubleshooting

**Error:** `distutils.errors.DistutilsOptionError: must supply either home or prefix/exec-prefix -- not both` when running `npm run viirs`
**Solution:** https://stackoverflow.com/questions/24257803/distutilsoptionerror-must-supply-either-home-or-prefix-exec-prefix-not-both

