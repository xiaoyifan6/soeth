export declare type EosContractSetting = {
    address: string;
    name: string;
    data: any[];
};
export declare type EthSetting = {
    contractURL: string;
    contracts: EosContractSetting | EosContractSetting[];
};
