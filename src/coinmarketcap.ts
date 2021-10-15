#!/usr/bin/env node
import { program } from 'commander';
import * as dotenv from 'dotenv';
import { CommandLoader } from './commands/command.loader';

const bootstrap = () => {
  dotenv.config({ path: __dirname + '/../.env' });

  program
    .usage('<command>')
    .helpOption('-h, --help', 'Информации об использовании.');

  CommandLoader.load(program);
  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
