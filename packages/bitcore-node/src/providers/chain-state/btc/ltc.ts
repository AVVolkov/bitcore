import { BTCStateProvider }  from './btc';

export class LTCStateProvider extends BTCStateProvider{
  constructor(chain: string = 'LTC') {
    super(chain);
  }
}
