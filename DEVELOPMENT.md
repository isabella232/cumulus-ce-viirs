# CCE Development

Before you start, setup your [Google OAuth2 client](https://developers.google.com/identity/protocols/OAuth2). 

1. Make sure master is up to date with cumulus-nasa/cumulus. 
  - https://help.github.com/articles/configuring-a-remote-for-a-fork/ and then https://help.github.com/articles/syncing-a-fork/
2. Install this repository in the same parent directory as the cumulus community edition fork. Make sure to run `nvm use` and other installation instructions for cumulus. Then:

```bash
npm link ../cumulus/packages/api @cumulus/api && \
npm link ../cumulus/packages/deployment @cumulus/deployment
```

3. Update .env with client id and client password from [your google APIs Application](https://console.developers.google.com/apis)
4. Deploy and update the [Google API callback URLs](https://console.developers.google.com/apis/credentials)