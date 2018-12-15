import { Base, SymbolType, APICreator, BaseAPI } from './base/Base'
import { EthApi } from './eth/EthApi'
import { EosApi } from './eos/EosApi'

const base: Base = new Base()

base.register(
  SymbolType.eos,
  new class implements APICreator {
    public generateAPI(config: any, mode: any): BaseAPI {
      return new EosApi(config, mode)
    }
  }()
)

base.register(
  SymbolType.eth,
  new class implements APICreator {
    public generateAPI(config: any, mode: any): BaseAPI {
      return new EthApi(config, mode)
    }
  }()
)

export const soeth = base
export let API = base.API
