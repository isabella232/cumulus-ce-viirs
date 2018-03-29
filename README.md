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

Note that this deploy repository includes this line in `app/config.yml`

```yaml
# app/config.yml
useCommunity: true
```

#### Updates to `@cumulus/deployment`

`node_modules/@cumulus/deployment/app/cumulus_api.template.yml` should use:

```
  {{# if ../parent.useCommunity}}
    {{# if this.communityHandler}}
      Handler: {{this.communityHandler}}
    {{else}}
      Handler: {{this.handler}}
    {{/if}}
  {{else}}
      Handler: {{this.handler}}
  {{/if}}
```

#### Updates to `@cumulus/deployment`

`node_modules/@cumulus/api/config/api_default.yml` and `/api_v1.yml` should include:

```yaml
ApiTokenDefault:
  handler: index.token
  communityHandler: index.communityToken
```

and 

```yaml
ApiTokenV1:
  handler: index.token
  communityHandler: index.communityToken
```

In order for this to work...

```javascript
# cumulus/packages/api/index.js
'use strict';

exports.token = require('./endpoints/token');
exports.communityToken = require('./endpoints/communityToken');
```

where `token` contains earth data login code and `communityToken` contains google oauth code.

Google oauth code is viewable at [developmentseed/cumulus-community-api/blob/master/endpoints/token.js](https://github.com/developmentseed/cumulus-community-api/blob/master/endpoints/token.js).
