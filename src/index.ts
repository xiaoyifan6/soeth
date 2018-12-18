const _base: base.Base = new base.Base()

_base.register(
  base.SymbolType.eos,
  new class implements base.APICreator {
    public generateAPI(core: any, config: any, mode: any): base.BaseAPI {
      return new eos.EosApi(core, config, mode)
    }
  }()
)

_base.register(
  base.SymbolType.eth,
  new class implements base.APICreator {
    public generateAPI(core: any, config: any, mode: any): base.BaseAPI {
      return new eth.EthApi(core, config, mode)
    }
  }()
)

export const soeth = _base
export let API = _base.API
