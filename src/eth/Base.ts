namespace eth {
  export type BigNumber = {
    toNumber: () => number
  }

  export type EosContractSetting = {
    address: string
    name: string
    data: any[]
  }

  export type EthSetting = {
    contractURL: string
    contracts: EosContractSetting | EosContractSetting[]
  }

  export const EthEvent = {
    NET_CHANGED: 'net changed callback'
  }
}
