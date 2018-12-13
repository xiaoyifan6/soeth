export type IAccount = {
    name: string,
    authority: string,
    blockchain: string
}

export type Identity = {
    hash: string,
    publicKey: string,
    name: string,
    kyc: boolean,
    accounts: IAccount[]
}

export type Scatter = {
    identity: Identity,
    requireVersion: Function,
    getIdentity: (param: any) => Promise<Identity>,
    eos: Function,
    eth: Function,
    forgetIdentity: Function
};

export type EosSetting = {
    privateKey?: string,
    defaultContract?: string,
    nets: string | string[],
    chainId: string,
}

class Net {
    protected _url: string;
    public get url(): string { return this._url; }
    public constructor(url: string) { this._url = url; }

    public get host(): string { return this._url.split(":")[1].replace(/\/\//g, ""); }

    public get port(): number { return parseInt(this._url.split(":")[2] || "443"); }

    public get protocal(): string { return this._url.split(":")[0]; }
}

class MultiNet extends Net {
    private _urls: {
        url: string,
        dt: number
    }[];

    public constructor(...urls: string[]) {
        super(urls[0]);
        this._urls = [];
        for (var i = 0; i < urls.length; i++) {
            this._urls[i] = { url: urls[i], dt: 0 };
        }
    }

    private sort() {
        this._urls.sort((a, b) => {
            return a.dt - b.dt;
        });
        this._urls.length > 0 && (this._url = this._urls[0].url);
    }

    public recorde(dt: number = Number.POSITIVE_INFINITY) {
        var a = this._urls[0];
        a && (a.dt = dt) && this.sort();
    }
}

export class EOSConfig {

    private _setting: EosSetting;
    private _nets: MultiNet;

    public get setting(): EosSetting {
        return this._setting;
    }

    public constructor(setting: EosSetting) {
        this._setting = setting;
        this._nets = new MultiNet(... (typeof this._setting.nets == "string" ? [this._setting.nets] : this._setting.nets));
    }

    public get url(): string { return this._nets.url; }
    public get httpEndpoint(): string { return this._nets.url; }

    public get host(): string { return this._nets.host; }
    public get port(): number { return this._nets.port; }
    public get protocal(): string { return this._nets.protocal; }

    public get privateKey(): string | undefined { return this._setting.privateKey; }

    public get defaultContract(): string | undefined { return this._setting.defaultContract; }

    public get chainId(): string { return this._setting.chainId; }

    public get eosNetwork() {
        return {
            blockchain: 'eos',
            host: this._nets.host,
            port: this._nets.port,
            protocol: this._nets.protocal,
            chainId: this._setting.chainId
        };
    }
}