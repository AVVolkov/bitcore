import { BTCStateProvider }  from './btc';

export class DASHStateProvider extends BTCStateProvider{
  constructor(chain: string = 'DASH') {
    super(chain);
  }
}
