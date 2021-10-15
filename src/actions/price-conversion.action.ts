import axios from 'axios';
import * as chalk from 'chalk';
import { InputInterface } from 'src/interfaces/input.interface';
import { PriceConversionInterface } from 'src/interfaces/price-conversion.interface';
import { ConfigurationService } from 'src/shared/configuration.service';
import { AbstractAction } from './abstract.action';

export class PriceConversionAction extends AbstractAction {
  private apiKey: string;
  private apiUrl: string;

  constructor(private configurationService: ConfigurationService) {
    super();
    this.apiKey = this.configurationService.etherscanApiKey;
    this.apiUrl = this.configurationService.etherscanApiUrl;
  }

  public async handle(inputs: InputInterface[], options: InputInterface[]) {
    const params = this.getInput(inputs);
    const option = this.getOption(options);
    if (option) {
      const tempFrom = params.from;
      params.from = params.to;
      params.to = tempFrom;
    }
    const amount = await this.priceConversion(params);
    console.info(
      chalk.green(`${params.amount} ${params.from} = ${amount} ${params.to}`),
    );
  }

  async priceConversion(params: PriceConversionInterface): Promise<number> {
    let currencyToId = await this.getCryptoCurrencyId(params.to);
    if (!currencyToId) {
      currencyToId = await this.getFiatCurrencyId(params.to);
    }
    let currencyFromId = await this.getCryptoCurrencyId(params.from);
    if (!currencyFromId) {
      currencyFromId = await this.getFiatCurrencyId(params.from);
    }
    const amount = await this.getPriceConversion(
      currencyFromId,
      currencyToId,
      params.amount,
    );
    return amount;
  }

  private getInput(inputs: InputInterface[]): PriceConversionInterface {
    const fromInput: InputInterface = inputs.find(
      (input) => input.name === 'from',
    );
    const toInput: InputInterface = inputs.find((input) => input.name === 'to');
    const amountInput: InputInterface = inputs.find(
      (input) => input.name === 'amount',
    );
    return {
      from: fromInput.value,
      to: toInput.value,
      amount: +amountInput.value,
    };
  }

  private getOption(options: InputInterface[]): boolean {
    const { value } = options.find((input) => input.name === 'reverse');
    return !!value;
  }

  private async getPriceConversion(
    fromCurrency: number,
    toCurrency: number,
    amount: number,
  ): Promise<number> {
    try {
      const response = await axios({
        method: 'GET',
        url: `${this.apiUrl}/tools/price-conversion?amount=${amount}&convert_id=${toCurrency}&id=${fromCurrency}`,
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
      });
      return response.data['data']['quote'][toCurrency]['price'];
    } catch (error) {
      console.error(
        chalk.red('Error API:', error.response.data.status.error_message),
      );
      process.exit(0);
    }
  }

  private async getFiatCurrencyId(symbolCurrency: string): Promise<number> {
    try {
      const fiatCurrency: any = await axios({
        method: 'GET',
        url: `${this.apiUrl}/fiat/map`,
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
      });
      const currencyMap = new Map<string, number>();
      fiatCurrency.data.data.forEach((it) => {
        currencyMap.set(it.symbol, it.id);
      });
      return currencyMap.get(symbolCurrency);
    } catch (error) {
      console.error(
        chalk.red('Error API:', error.response.data.status.error_message),
      );
      process.exit(0);
    }
  }

  private async getCryptoCurrencyId(symbolCurrency: string): Promise<number> {
    try {
      const cryptoCurrency = await axios({
        method: 'GET',
        url: `${this.apiUrl}/cryptocurrency/info`,
        params: {
          symbol: symbolCurrency,
        },
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
      });
      return cryptoCurrency.data['data'][symbolCurrency]['id'];
    } catch (error) {
      console.error(
        chalk.red('Error API:', error.response.data.status.error_message),
      );
      process.exit(0);
    }
  }
}
