export declare type IAccount = {
    name: string;
    authority: string;
    blockchain: string;
};
export declare type Identity = {
    hash: string;
    publicKey: string;
    name: string;
    kyc: boolean;
    accounts: IAccount[];
};
export declare type Scatter = {
    identity: Identity;
    requireVersion: Function;
    getIdentity: (param: any) => Promise<Identity>;
    eos: Function;
    eth: Function;
    forgetIdentity: Function;
};
export declare type EosSetting = {
    privateKey?: string;
    defaultContract?: string;
    nets: string | string[];
    chainId: string;
};
export declare class EOSConfig {
    private _setting;
    private _nets;
    readonly setting: EosSetting;
    constructor(setting: EosSetting);
    readonly url: string;
    readonly httpEndpoint: string;
    readonly host: string;
    readonly port: number;
    readonly protocal: string;
    readonly privateKey: string | undefined;
    readonly defaultContract: string | undefined;
    readonly chainId: string;
    readonly eosNetwork: {
        blockchain: string;
        host: string;
        port: number;
        protocol: string;
        chainId: string;
    };
}
