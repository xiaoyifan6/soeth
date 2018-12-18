namespace base {
  type EventObj = {
    event_cbk: EventCBK
    thisObj?: any
  }

  export abstract class CustomApi implements BaseAPI {
    private _mode: string
    private _isRunning: boolean
    private _tIndex: number

    private _core: any

    protected event_Map: { [eventName: string]: EventObj[] }
    // protected error_cbk: NullableFunction
    // protected account_changed_cbk: NullableFunction
    // protected contract_cbk: NullableFunction
    // protected identity_cbk: NullableFunction

    protected get core(): any {
      return this._core
    }

    public get mode(): string {
      return this._mode
    }
    public get isRunning(): boolean {
      return this._isRunning
    }

    public addEventListener(name: string, cbk: EventCBK, thisObj?: any): BaseAPI {
      if (this.event_Map[name]) {
        let obj = this.event_Map[name].find(v => {
          return v.event_cbk === cbk && ((v.thisObj && v.thisObj === thisObj) || (!v.thisObj && !thisObj))
        })
        if (obj) return this
      } else {
        this.event_Map[name] = []
      }

      this.event_Map[name].push({
        event_cbk: cbk,
        thisObj: thisObj
      })
      return this
    }

    protected onError(errorCode: number, detail?: any): CustomApi {
      this.invorkEvent(base.BaseEvent.ERROR_CBK, {
        errorCode: errorCode,
        detail: detail
      })
      return this
    }

    protected onContract(status: number, detail?: any) {
      this.invorkEvent(base.BaseEvent.CONTRACT_CBK, {
        errorCode: status,
        detail: detail
      })
      return this
    }

    protected async invorkEvent(name: string, data: any) {
      const eventList = this.event_Map[name]
      if (eventList) {
        for (let i = 0; i < eventList.length; i++) {
          let eventObj = eventList[i]
          eventObj.event_cbk.apply(eventObj.thisObj || window, [
            {
              target: eventObj.thisObj,
              data: data
            }
          ])
        }
      }
    }

    public removeEventListener(name: string, cbk: EventCBK, thisObj?: any): BaseAPI {
      if (this.event_Map[name]) {
        let obj = this.event_Map[name].find(v => {
          return v.event_cbk === cbk && ((v.thisObj && v.thisObj === thisObj) || (!v.thisObj && !thisObj))
        })
        let index = obj ? this.event_Map[name].indexOf(obj) : -1
        if (index > -1) {
          this.event_Map[name].splice(index, 1)
        }
      }
      return this
    }

    // public onEvent(cbk: Function): BaseAPI {
    //   this.error_cbk = cbk
    //   return this
    // } // 事件调用

    // public onError(cbk: Function): BaseAPI {
    //   this.error_cbk = cbk
    //   return this
    // } // 错误

    // public onAccountChanged(cbk: Function): BaseAPI {
    //   this.account_changed_cbk = cbk
    //   return this
    // } // 账号切换

    // public onIdentity(cbk: Function): BaseAPI {
    //   this.identity_cbk = cbk
    //   return this
    // } // 是否授权

    // public onContract(cbk: Function): BaseAPI {
    //   this.contract_cbk = cbk
    //   return this
    // } // 合约调用

    public getMode(): string {
      return this._mode
    }

    protected sleep(t: number) {
      return new Promise<any>(resolve => {
        setTimeout(() => {
          resolve()
        }, t)
      })
    }

    protected start() {
      this.updateStatus()

      if (!this.usePlugin() || this._isRunning) return
      this._isRunning = true
      let self = this
      this._tIndex = window.setInterval(() => {
        if (!self._isRunning) {
          clearInterval(self._tIndex)
        }
        self.updateStatus()
      }, 10000)
    }

    protected stop() {
      this._isRunning = false
    }

    abstract getSymbol(): string
    abstract plugin(): string
    abstract usePlugin(): boolean
    abstract isInitPlugin(): boolean
    abstract hasAccount(): boolean
    abstract defaultAccount(): string
    abstract check(): boolean
    abstract addEvent(name: string, cbk: Function): void

    protected updateStatus(): void {
      // 更新状态 只有使用插件时会用到
    }

    public constructor(_core: any, mode: string) {
      this._mode = mode
      this._isRunning = false
      this._tIndex = 0
      this.event_Map = {}

      this.start()
    }
  }
}
