import { SymbolType, ErrorCode } from '../base/Base'
import { CustomApi } from '../base/CustomApi'
import { Web3 } from 'web3'
import { EthSetting } from './Base'
import BigNumber from 'bignumber'

export class EthApi extends CustomApi {
  protected _web3: Web3 | undefined
  protected _web3_browser: Web3 | undefined
  protected _netId: string

  protected _config: EthSetting
  protected _account: string | undefined

  protected _contractMap: { [name: string]: Web3.Contract<any> }
  protected _contractBMap: { [name: string]: Web3.Contract<any> }

  protected net_changed_cbk: Function | undefined

  public onNetChanged(cbk: Function) {
    this.net_changed_cbk = cbk
  }

  public constructor(config: EthSetting, mode: string) {
    super(mode)

    this._config = config
    this._netId = ''
    this._contractMap = {}
    this._contractBMap = {}

    const win: any = window
    const ethereum = win['ethereum']

    if (ethereum) {
      this._web3 = new Web3(ethereum)
      this.requireIdentity()
    }
    this._web3_browser = new Web3(new Web3.providers.HttpProvider(this._config.contractURL))
    const contracts = this._config.contracts instanceof Array ? this._config.contracts : [this._config.contracts]

    for (let contract of contracts) {
      this._web3 && (this._contractMap[contract.name] = this._web3.eth.contract(contract.data).at(contract.address))
      this._web3_browser &&
        (this._contractMap[contract.name] = this._web3_browser.eth.contract(contract.data).at(contract.address))
    }
  }

  public async requireIdentity() {
    const win: any = window
    const ethereum = win['ethereum']
    if (!ethereum) return
    try {
      await ethereum.enable()
    } catch (e) {
      this.error_cbk && this.error_cbk(ErrorCode.MissIdentity, e)
    }
  }

  protected updateStatus() {
    super.updateStatus()

    if (!this.isInitPlugin()) {
      const win: any = window
      const ethereum = win['ethereum']

      if (ethereum) {
        this._web3 = new Web3(ethereum)
        this._web3_browser = new Web3(new Web3.providers.HttpProvider(this._config.contractURL))
        this.requireIdentity()
      }
    }

    let web3 = this._web3
    if (!web3) return

    // 检查网络状态
    web3.version.getNetwork((err: Error, netId: string) => {
      if (netId !== this._netId) {
        this.net_changed_cbk && this.net_changed_cbk(netId, this._netId)
        this._netId = netId
      }

      err && this.error_cbk && this.error_cbk(ErrorCode.NetError, err)
    })
    // 检查账号是否切换
    web3.eth.getAccounts((err, res) => {
      // 检查是否切换账户
      if (res.length === 0) {
        return
      }

      const account = res[0]
      if (account !== this._account) {
        this.account_changed_cbk && this.account_changed_cbk(account, this._account)
        this._account = account
      }

      err && this.error_cbk && this.error_cbk(ErrorCode.AccountError, err)
    })
  }

  public getSymbol(): string {
    return SymbolType.eth
  } // eos或者eth

  public plugin(): string {
    return 'MateMask'
  } // 插件名称

  public usePlugin(): boolean {
    return true
  } // 是否使用插件

  public isInitPlugin(): boolean {
    return this._web3 !== undefined
  } // 插件是否初始化了

  public hasAccount(): boolean {
    return this._account !== undefined
  } // 是否有账号

  public defaultAccount(): string {
    return this._web3 ? this._web3.eth.defaultAccount : ''
  } // 获取默认账号

  public check(): boolean {
    if (this.isInitPlugin()) {
      this.error_cbk && this.error_cbk(ErrorCode.PluginNotInit)
      return false
    } else if (this.hasAccount()) {
      this.error_cbk && this.error_cbk(ErrorCode.AccountNotFound)
      return false
    } else if (!this._netId) {
      this.error_cbk && this.error_cbk(ErrorCode.NetNotReady)
      return false
    }
    return true
  }

  public getBalance() {
    const self = this
    return new Promise<number>((resolve, reject) => {
      if (!self._web3) {
        resolve(0)
        return
      }
      self._web3.eth.getBalance(this.defaultAccount(), (err: Error, result: BigNumber) => {
        resolve(err ? 0 : result.toNumber())
      })
    })
  }

  protected getGasPrice(): Promise<number> {
    const self = this
    return new Promise((resolve, reject) => {
      if (!self._web3) {
        resolve(1)
        return
      }
      self._web3.eth.getGasPrice((err: Error, res: BigNumber) => {
        resolve(err ? 1 : res.toNumber())
      })
    })
  }

  public hexCharCodeToStr(hexCharCodeStr: string): string {
    if (!hexCharCodeStr) return ''
    let trimedStr = hexCharCodeStr.trim()
    let rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr
    let len = rawStr.length
    if (len % 2 !== 0) {
      console.warn('Illegal Format ASCII Code!')
      return ''
    }
    let curCharCode
    const resultStr = []
    for (let i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
      let char = String.fromCharCode(curCharCode)
      if (char !== '\u0000') resultStr.push(char)
    }
    return resultStr.join('')
  }

  public format2Eth(wei: BigNumber) {
    let num: number = wei ? wei.toNumber() : 0
    return num / Math.pow(10, 18)
  }

  public getTransactionReceiptByHash(hash: string) {
    const self = this
    return new Promise<Web3.TransactionReceipt>((resolve, reject) => {
      if (!hash) {
        reject()
        return
      }
      if (!self._web3) {
        reject()
        return
      }
      self._web3.eth.getTransactionReceipt(hash, (err: Error, receipt: Web3.TransactionReceipt) => {
        if (err) {
          reject(err)
        } else {
          resolve(receipt)
        }
      })
    })
  }

  public addEvent(name: string, cbk: Function): void {
    // todo
  }
}
