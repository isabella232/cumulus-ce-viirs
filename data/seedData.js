const fs = require('fs');
const yaml = require('js-yaml');

const { addProviders, addCollections } = require('@cumulus/integration-tests');

const collectionsDirectory = './data/collections';
const providersDirectory = './data/providers';

const config = yaml.safeLoad(fs.readFileSync('./app/config.yml'), 'utf8').default;
console.log(config)

async function seedData() {
  const collections = await addCollections(config.stackName, config.buckets.internal, collectionsDirectory);
  const providers = await addProviders(config.stackName, config.buckets.internal, providersDirectory);

  console.log(`Created ${providers} providers`);
  console.log(`Created ${collections} collections`)
  return { providers, collections };
};

seedData();
