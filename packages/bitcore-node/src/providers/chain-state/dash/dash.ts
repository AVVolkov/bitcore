import { BTCStateProvider }  from '../btc/btc';

export class DASHStateProvider extends BTCStateProvider {
  constructor(chain: string = 'DASH') {
    super(chain);
  }
}
