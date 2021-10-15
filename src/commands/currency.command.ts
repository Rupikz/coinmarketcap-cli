import { Command } from 'commander';
import { InputInterface } from '../interfaces/input.interface';
import { AbstractCommand } from './abstract.command';

export class CurrencyCommand extends AbstractCommand {
  public load(program: Command): void {
    program
      .command('currency <name>')
      .description('Проверка существования валюты по ее коду.')
      .allowUnknownOption()
      .action(async (name: string) => {
        const inputs: InputInterface[] = [];
        inputs.push({ name: 'name', value: name });
        try {
          await this.action.handle(inputs);
        } catch (err) {
          process.exit(0);
        }
      });
  }
}
