export class ConfigurationService {
  get etherscanApiKey(): string {
    return process.env['API_COINMARKETCAP_KEY'];
  }

  get etherscanApiUrl(): string {
    return process.env['API_COINMARKETCAP_URL'];
  }
}
