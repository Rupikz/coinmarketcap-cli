import axios from 'axios';
import * as chalk from 'chalk';
import { InputInterface } from 'src/interfaces/input.interface';
import { ConfigurationService } from '../shared/configuration.service';
import { AbstractAction } from './abstract.action';

export class CurrencyAction extends AbstractAction {
  private apiKey: string;
  private apiUrl: string;

  constructor(private configurationService: ConfigurationService) {
    super();
    this.apiKey = this.configurationService.etherscanApiKey;
    this.apiUrl = this.configurationService.etherscanApiUrl;
  }

  public async handle(inputs: InputInterface[]) {
    const currencyName = this.getInput(inputs);
    const isExist = await this.currencyMap(currencyName);
    if (isExist) {
      console.info(chalk.green('Валюта найдена'));
    } else {
      console.error(chalk.red('Валюта не найдена'));
    }
  }

  private getInput(inputs: InputInterface[]): string {
    const nameInput: InputInterface = inputs.find(
      (input) => input.name === 'name',
    );
    return nameInput.value;
  }

  private async currencyMap(currency: string): Promise<boolean> {
    try {
      const response: any = await axios({
        method: 'GET',
        url: `${this.apiUrl}/cryptocurrency/map`,
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
      });
      const currencies = response.data.data.map((it) => it.symbol);
      return currencies.includes(currency);
    } catch (error) {
      console.error(
        chalk.red('Ошибка API:', error.response.data.status.error_message),
      );
      process.exit(0);
    }
  }
}
