namespace eos {
  export class EosApi extends base.CustomApi {
    protected _scatter: Scatter | undefined
    protected _eos: Eos | undefined
    protected _config: EOSConfig
    protected _account: IAccount | undefined

    protected miss_identity_cbk: Function | undefined

    private formatEos(value: string) {
      return parseFloat(value)
    }

    public constructor(config: EosSetting, mode: string) {
      super(mode)
      this._config = new EOSConfig(config)

      const win: any = window
      this._scatter = win['scatter']
      if (this._scatter) {
        this._scatter.requireVersion(3.0)
        this._eos = this._scatter.eos(this._config.eosNetwork, win['Eos'], {}, this._config.protocal)
      } else {
        this._eos = undefined
      }
    }

    public get eos(): Eos | undefined {
      return this._eos
    }

    public getSymbol(): string {
      return base.SymbolType.eos
    } // eos或者eth

    public plugin(): string {
      return 'Scatter'
    } // 插件名称

    public usePlugin(): boolean {
      return true
    } // 是否使用插件

    public isInitPlugin(): boolean {
      return this._eos !== undefined
    } // 插件是否初始化了

    public hasAccount(): boolean {
      return this._account !== undefined
    } // 是否有账号

    public defaultAccount(): string {
      return this._account ? this._account.name : ''
    } // 获取默认账号

    public check(): boolean {
      if (this.isInitPlugin()) {
        this.error_cbk && this.error_cbk(base.ErrorCode.PluginNotInit)
        return false
      } else if (this.hasAccount()) {
        this.error_cbk && this.error_cbk(base.ErrorCode.AccountNotFound)
        return false
      } else if (!this.identity) {
        this.error_cbk && this.error_cbk(base.ErrorCode.MissIdentity)
        this.miss_identity_cbk && this.miss_identity_cbk()
        return false
      }
      return true
    }

    public get identity(): Identity | undefined {
      return this._scatter ? this._scatter.identity : undefined
    }

    public addEvent(name: string, cbk: Function): void {
      // todo
    }

    public forgetIdentity() {
      this._scatter && this._scatter.forgetIdentity()
    }

    protected updateStatus(): void {
      super.updateStatus()

      const win: any = window
      if (!this._scatter) {
        win['scatter'] && (this._scatter = win['scatter'])
        if (this._scatter) {
          this._scatter.requireVersion(3.0)
          this._eos = this._scatter.eos(this._config.eosNetwork, win['Eos'], {}, this._config.protocal)
        }
      }

      if (this.identity) {
        const name = this.defaultAccount()

        this._account = this.identity.accounts.find(accound => {
          return accound.blockchain === 'eos'
        })

        if (name !== this.defaultAccount()) {
          this.account_changed_cbk && this.account_changed_cbk(this.defaultAccount(), name)
        }
      }
    }

    public onMissItentity(cbk: Function): EosApi {
      this.miss_identity_cbk = cbk
      return this
    }

    public encode(value: string): string {
      const win: any = Window
      return win['Eos'].modules.format.encodeName(value, false)
    }

    public decode(value: string): string {
      const win: any = Window
      return win['Eos'].modules.format.decodeName(value.toString(), false)
    }

    public async requireIdentity() {
      if (!this._scatter) {
        this.error_cbk && this.error_cbk(base.ErrorCode.PluginNotInit)
        throw { errorCode: base.ErrorCode.PluginNotInit }
      }

      try {
        const res = await this._scatter.getIdentity({ accounts: [this._config.eosNetwork] })
        if (res) {
          this._account = res.accounts.find(accound => {
            return accound.blockchain === 'eos'
          })
          return res
        } else {
          this.error_cbk && this.error_cbk(base.ErrorCode.AccountNotFound)
          throw { errorCode: base.ErrorCode.AccountNotFound }
        }
      } catch (e) {
        throw e
      }
    }

    public async getBalance() {
      let eos = this.eos
      if (!eos) return 0
      const res = await eos.getCurrencyBalance('eosio.token', this.defaultAccount(), this.getSymbol().toUpperCase())
      return res && res.length > 0 ? parseFloat(res[0]) : 0
    }

    public getAccountInfo() {
      let eos = this.eos
      if (!eos) return undefined
      return eos.getAccount(this.defaultAccount())
    }

    public transaction(account: IAccount, to: string, currency: string, memo: string = '') {
      let eos = this.eos
      if (!eos) return undefined
      return eos.transaction(
        {
          actions: [
            {
              account: 'eosio.token',
              name: 'transfer',
              authorization: [
                {
                  actor: account.name,
                  permission: account.authority
                }
              ],
              data: {
                from: account.name,
                to: to,
                quantity: currency, // 注意 要4位小数
                memo: memo
              }
            }
          ]
        },
        { broadcast: true, sign: true }
      )
    }

    public getAuthorization(): string {
      const account = this._account
      return account ? `${account.name}@${account.authority}` : ''
    }

    public async doAction(contractName: string, actionName: string, authorization: string | string[], ...param: any[]) {
      let eos = this.eos
      if (!eos) return undefined

      const options = {
        authorization: typeof authorization === 'string' ? [authorization] : authorization
      }

      const contract = await eos.contract(contractName)
      if (!contract) return undefined
      const res = await contract[actionName].apply(window, param.concat(options))
      return res
    }

    public async doSimpleAction(actionName: string, ...param: any[]) {
      let res = undefined
      if (this._config.defaultContract) {
        res = await this.doAction(this._config.defaultContract, actionName, this.getAuthorization(), ...param)
      }
      return res
    }

    public async getTableRows(
      table: string,
      scope: string,
      contractName?: string,
      limit?: number,
      lower_bound?: number,
      table_key?: string
    ) {
      if (!contractName) {
        if (!this._config.defaultContract) return { rows: [], more: false }
        contractName = this._config.defaultContract
      }
      try {
        const param: any = {
          code: contractName,
          scope: scope,
          table: table,
          json: true,
          lower_bound: lower_bound
        }
        limit && (param['limit'] = limit)
        table_key && (param['table_key'] = table_key)

        if (!this.eos) return { rows: [], more: false }
        return await this.eos.getTableRows(param)
      } catch (e) {
        throw e
      }
    }

    public async getAllTableRows(scope: string | number, tableName: string, table_key?: string, contractName?: string) {
      if (!contractName) {
        if (!this._config.defaultContract) return []
        contractName = this._config.defaultContract
      }
      if (!scope) return []

      const result = new Array<any>()
      const limit = 10
      let lower_bound = 0
      while (true) {
        const data = await this.getTableRows(tableName, scope.toString(), contractName, limit, lower_bound, table_key)
        if (!data) break

        if (data.rows && data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            result.push(data.rows[i])
          }
          lower_bound += data.rows.length
          if (!data.more) break
        } else {
          break
        }
      }
      return result
    }

    public async getGlobalData() {
      const res = await this.getTableRows('eosio', 'global', 'eosio')
      if (res && res.rows && res.rows.length > 0) return res.rows[0]
      return null
    }

    public async getRamPrice() {
      const res = await this.getTableRows('eosio', 'rammarket', 'eosio')
      if (res && res.rows && res.rows.length > 0) {
        return (this.formatEos(res.rows[0].quote.balance) / this.formatEos(res.rows[0].base.balance)) * 1024
      }
      return 0
    }

    public async buyRam(ramAmount: number) {
      try {
        this.contract_cbk && this.contract_cbk(0)
        const res = await this.doAction('eosio', 'buyrambytes', this.defaultAccount(), this.defaultAccount(), ramAmount)
        this.contract_cbk && this.contract_cbk(1, res)
        return res
      } catch (e) {
        this.handleError(e)
        throw e
      } finally {
        this.contract_cbk && this.contract_cbk(3)
      }
    }

    public async getNetCpuPrice() {
      const res = await this.getAccountInfo()
      let netPrice = 0
      let cpuPrice = 0
      if (res) {
        // 1. 计算NET价格
        // 抵押NET的EOS数量
        let netBalance = res.net_weight / 10000
        // NET贷款的总量
        let netTotal = res.net_limit.max / 1024
        // (netBalance / netTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
        netPrice = netBalance / netTotal / 3
        console.log(netBalance, netTotal, netPrice)

        // 1. 计算CPU价格
        // 抵押CPU的EOS数量
        const cpuBalance = res.cpu_weight / 10000
        // CPU贷款的总量
        const cpuTotal = res.cpu_limit.max / 1024
        // (cpuBalance / cpuTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
        cpuPrice = cpuBalance / cpuTotal / 3
      }
      return {
        netPrice: netPrice,
        cpuPrice: cpuPrice
      }
    }

    public async sellRam(ramAmount: number) {
      try {
        this.contract_cbk && this.contract_cbk(0)
        const res = await this.doAction('eosio', 'sellram', this.defaultAccount(), ramAmount)
        this.contract_cbk && this.contract_cbk(1, res)
        return res
      } catch (e) {
        this.handleError(e)
        throw e
      } finally {
        this.contract_cbk && this.contract_cbk(3)
      }
    }

    // 抵押EOS购买NET、CPU
    public async delegatebw(net_amount: number, cpu_amount: number) {
      try {
        this.contract_cbk && this.contract_cbk(0)
        const res = await this.doAction(
          'eosio',
          'delegatebw',
          this.defaultAccount(),
          this.defaultAccount(),
          `${net_amount.toFixed(4)} EOS`,
          `${cpu_amount.toFixed(4)} EOS`,
          0
        )
        this.contract_cbk && this.contract_cbk(1, res)
        return res
      } catch (e) {
        this.handleError(e)
        throw e
      } finally {
        this.contract_cbk && this.contract_cbk(3)
      }
    }

    // 从NET、CPU资源中赎回EOS
    public async undelegatebw(net_amount: number, cpu_amount: number) {
      try {
        this.contract_cbk && this.contract_cbk(0)
        const res = await this.doAction(
          'eosio',
          'undelegatebw',
          this.defaultAccount(),
          this.defaultAccount(),
          `${net_amount.toFixed(4)} EOS`,
          `${cpu_amount.toFixed(4)} EOS`
        )
        this.contract_cbk && this.contract_cbk(1, res)
        return res
      } catch (e) {
        this.handleError(e)
        throw e
      } finally {
        this.contract_cbk && this.contract_cbk(3)
      }
    }

    private handleError(e: any) {
      if (!e) return

      if (typeof e === 'string') {
        try {
          const obj = JSON.parse(e)
          typeof obj === 'object' && obj && (e = obj)
        } catch (e) {
          // e
        }
      }

      this.error_cbk &&
        (e.error && e.error.details
          ? this.error_cbk(base.ErrorCode.TranSactionError, e)
          : this.error_cbk(base.ErrorCode.UnknowError, e))
    }
  }
}
