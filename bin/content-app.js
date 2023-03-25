#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const contentful = require('contentful-management');
const contentApp = require('@content-app/core').default;
const program = new Command();
const path = require('path');


program
  .command('load-content-types')
  .description('Loads content types')
  .requiredOption('-a, --accessToken <accessToken>', 'Access token')
  .requiredOption('-s, --spaceId <spaceId>', 'Space ID')
  .option('-e, --environment <environment>', 'Environment')
  .action((cmd) => {
    const { accessToken, spaceId, environment } = cmd;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Are you sure you want to use these values? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log(`Loading content types with accessToken: ${accessToken}, spaceId: ${spaceId}, environment: ${environment || 'default'}`);

        const client = contentful.createClient({
          accessToken: accessToken,
        })
        
        try {
          await contentApp.createCoreModels(client, {
            spaceId: spaceId,
            environment: environment || 'master' || 'main',
        });
        } catch (error) {
          console.error(console.error(error));
        }
        
      } else {
        console.log('Aborted.');
      }
      rl.close();
    });
  });

  program
  .command('load-content-module <contentModule>')
  .description('Loads a content module from a JavaScript file')
  .requiredOption('-a, --accessToken <accessToken>', 'Access token')
  .requiredOption('-s, --spaceId <spaceId>', 'Space ID')
  .option('-e, --environment <environment>', 'Environment')
  .action(async (contentModule, cmd) => {
    const { accessToken, spaceId, environment } = cmd;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(`Are you sure you want to load the content module ${contentModule} into accessToken: ${accessToken}, spaceId: ${spaceId}, environment: ${environment || 'default'}? (y/n) `, async (answer) => {
      if (answer.toLowerCase() === 'y') {
        const modulePath = path.join(process.cwd(), 'node_modules', `@content-app/content-module_${contentModule}/install.js`);
        console.log(modulePath)
        const contentModuleInstall = require(modulePath);
        
        const client = contentful.createClient({
          accessToken: accessToken,
        });

        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environment || 'master' || 'main');
        
        try {
          await contentModuleInstall({
            client: client,
            space: space,
            environment: environment,
          })
        } catch (error) {
          console.error(error);
        }
        
      } else {
        console.log('Aborted.');
      }
      rl.close();
    });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
