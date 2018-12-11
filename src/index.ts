export class SoethAPI {

    private _config: any;

    public get config(): any {
        return this._config;
    }

    public constructor(config: any) {
        this._config = config;
    }

    public helloWorld() {
        console.log("hello world");
    }

}