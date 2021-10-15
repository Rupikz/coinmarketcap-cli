import * as chalk from 'chalk';
import { Command } from 'commander';
import { CurrencyAction } from '../actions/currency.action';
import { PriceConversionAction } from '../actions/price-conversion.action';
import { ConfigurationService } from '../shared/configuration.service';
import { CurrencyCommand } from './currency.command';
import { PriceConversionCommand } from './price-conversion.command';

export class CommandLoader {
  public static load(program: Command): void {
    const config = new ConfigurationService();
    new PriceConversionCommand(new PriceConversionAction(config)).load(program);
    new CurrencyCommand(new CurrencyAction(config)).load(program);
    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\nНеверная команда: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `В разделе ${chalk.red('--help')} смотрите список доступных команд.\n`,
      );
      process.exit(1);
    });
  }
}
