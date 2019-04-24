import { ETHStateProvider }  from './eth';

export class ETCStateProvider extends ETHStateProvider{
  constructor(chain: string = 'ETC') {
    super(chain);
  }
}
