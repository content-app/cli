#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
import contentful from 'contentful-management';
import { createCoreModels } from '@content-app/core';
const program = new Command();

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
          await createCoreModels(client, {
            spaceId: spaceId,
            environment: environment || 'master' || 'main',
        });
        } catch (error) {
          console.error(console.error());
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
