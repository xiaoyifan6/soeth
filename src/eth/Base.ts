export type EosContractSetting = {
  address: string
  name: string
  data: any[]
}

export type EthSetting = {
  contractURL: string
  contracts: EosContractSetting | EosContractSetting[]
}
