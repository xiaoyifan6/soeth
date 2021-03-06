namespace base {
  export const SymbolType = {
    eth: 'eth',
    eos: 'eos'
  }

  export const BaseEvent = {
    EVENT_CBK: 'event callback',
    ERROR_CBK: 'error callback',
    ACCOUNT_CHANGED: 'account changed',
    CONTRACT_CBK: 'contract callbact',
    IDENTITY_CBK: 'identity callback'
  }

  export type Event = {
    target: any
    data: any
  }

  export type EventCBK = (e: Event) => void

  export interface BaseAPI {
    getSymbol(): string // eos或者eth
    plugin(): string // 插件名称
    getMode(): string // 模式: local/testnet/mainet

    usePlugin(): boolean // 是否使用插件
    isInitPlugin(): boolean // 插件是否初始化了
    hasAccount(): boolean // 是否有账号
    defaultAccount(): string // 获取默认账号

    check(): boolean // 检查钱包是否可用
    addEvent(name: string, cbk: Function): void

    addEventListener(name: string, cbk: EventCBK, thisObj?: any): BaseAPI
    removeEventListener(name: string, cbk: EventCBK, thisObj?: any): BaseAPI

    // onEvent(cbk: Function): BaseAPI // 事件调用
    // onError(cbk: Function): BaseAPI // 错误
    // onAccountChanged(cbk: Function): BaseAPI // 账号切换
    // onIdentity(cbk: Function): BaseAPI // 是否授权
    // onContract(cbk: Function): BaseAPI // 合约调用
  }

  export const ErrorCode = {
    PluginNotInit: 1000,
    AccountNotFound: 1001,
    MissIdentity: 1002,

    TranSactionError: 1003,
    NetError: 1004,
    AccountError: 1005,

    NetNotReady: 1006,

    UnknowError: -1
  }

  export interface APICreator {
    generateAPI(core: any, config: any, mode: any): BaseAPI
  }

  export class Net {
    protected _url: string
    public get url(): string {
      return this._url
    }
    public constructor(url: string) {
      this._url = url
    }

    public get host(): string {
      return this._url.split(':')[1].replace(/\/\//g, '')
    }

    public get port(): number {
      return parseInt(this._url.split(':')[2] || '443', 10)
    }

    public get protocal(): string {
      return this._url.split(':')[0]
    }
  }

  export class Base {
    private _API: BaseAPI | undefined

    private _createMap: { [key: string]: APICreator } = {}
    private _apiMap: { [key: string]: BaseAPI } = {}

    private generateKey(symbol: string, mode: string): string {
      return symbol + '_' + mode
    }

    /**
     * 初始化sdk
     * @param symbol eth/eos
     * @param core Eos/Web3
     * @param config
     * @param mode
     */
    public initSdk(symbol: string, core: any, config: any, mode: string = ''): BaseAPI {
      const key = this.generateKey(symbol, mode)
      return (this._API = this._apiMap[key] = this._createMap[symbol].generateAPI(core, config, mode))
    }

    public register(symbol: string, creator: APICreator) {
      this._createMap[symbol] = creator
    }

    public get API(): BaseAPI | undefined {
      return this._API
    }

    public get symbolName(): string {
      return this._API === undefined ? '' : this._API.getSymbol()
    }

    public get plugin(): string {
      return this._API === undefined ? '' : this._API.plugin()
    }

    public canUse(symbol: string, mode: string = '') {
      const key = this.generateKey(symbol, mode)
      return this._apiMap[key] !== undefined
    }

    public use(symbol: string, mode: string = '') {
      const key = this.generateKey(symbol, mode)
      return this.canUse(symbol, mode) ? (this._API = this._apiMap[key]) : undefined
    }
  }
}
