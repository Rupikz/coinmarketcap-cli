import { Command } from 'commander';
import { InputInterface } from '../interfaces/input.interface';
import { AbstractCommand } from './abstract.command';

export class PriceConversionCommand extends AbstractCommand {
  public load(program: Command): void {
    program
      .command('conversion <from> <to> <amount>')
      .option('-r, --reverse', 'Поменять валюты местами')
      .description('Конвертер криптовалют.')
      .action(
        async (from: string, to: string, amount: string, command: Command) => {
          const inputs: InputInterface[] = [];
          inputs.push({ name: 'from', value: from });
          inputs.push({ name: 'to', value: to });
          inputs.push({ name: 'amount', value: amount });

          const options: InputInterface[] = [];
          options.push({ name: 'reverse', value: command['reverse'] });
          try {
            await this.action.handle(inputs, options);
          } catch (err) {
            process.exit(0);
          }
        },
      );
  }
}
