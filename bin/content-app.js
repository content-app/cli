#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const contentful = require('contentful-management');
const contentApp = require('@content-app/core').default;
const program = new Command();
const path = require('path');
require('dotenv').config();


program
  .command('load-content-types')
  .description('Loads content types')
  .option('-a, --accessToken <accessToken>', 'Access token')
  .option('-s, --spaceId <spaceId>', 'Space ID')
  .option('-e, --environment <environment>', 'Environment')
  .action((cmd) => {
    const { accessToken, spaceId, environment } = cmd;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Are you sure you want to use these values? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        const finalAccessToken = accessToken || process.env.MANAGEMENT_ACCESS_TOKEN;
        const finalSpaceId = spaceId || process.env.SPACE_ID;
        const finalEnvironment = environment || process.env.ENVIRONMENT || 'master' || 'main';

        const client = contentful.createClient({
          accessToken: finalAccessToken,
        });
        
        try {
          await contentApp.createCoreModels(client, {
            spaceId: finalSpaceId,
            environment: finalEnvironment,
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
  .option('-a, --accessToken <accessToken>', 'Access token')
  .option('-s, --spaceId <spaceId>', 'Space ID')
  .option('-e, --environment <environment>', 'Environment')
  .action(async (contentModule, cmd) => {
    const { accessToken, spaceId, environment } = cmd;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Are you sure you want to use these values? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        const finalAccessToken = accessToken || process.env.MANAGEMENT_ACCESS_TOKEN;
        const finalSpaceId = spaceId || process.env.SPACE_ID;
        const finalEnvironment = environment || process.env.ENVIRONMENT || 'master' || 'main';

        const modulePath = path.join(process.cwd(), 'node_modules', `@content-app/content-module_${contentModule}/install.js`);
        const contentModuleInstall = require(modulePath);
        
        const client = contentful.createClient({
          accessToken: finalAccessToken,
        });

        const space = await client.getSpace(finalSpaceId);
        const spaceEnvironment = await space.getEnvironment(finalEnvironment);
        
        try {
          await contentModuleInstall({
            client: client,
            space: space,
            environment: spaceEnvironment,
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
