#  Cumulus Community Template Deploy

This is a WIP edition of a template for the general public to use Cumulus.

## What is Cumulus?

Cumulus is a cloud-based data ingest, archive, distribution and management
prototype for NASA's future Earth science data streams.

Read the [Cumulus Documentation](https://cumulus-nasa.github.io/)

## Installation

```bash
nvm use
npm install
```

### How to configure your test stack

Your default AWS credentials should be the same credentials used for the deployment.

To use a different stack name, update `app/config.yml` and `iam/config.yml`.

### Current haxx

* `node_modules/@cumulus/deployment/app/cumulus_api_default.config.yml` and `.../cumulus_api_v1.config.yml` have been edited, after installation, to reference `node_modules/@cumulus-community/api/config/api_default.yml` and `.../api_v1.yml`.
* `@cumulus-community/api` is installed from github. `@cumulus-community/api` is an adaptation of `@cumulus/api` such that it uses all lambdas from the `@cumulus/api` npm package _except_ the token endpoints. And eventually the distribution endpoints.
