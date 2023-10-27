export default class UploadAdapter {
    constructor(loader: any, type: any);
    loader: any;
    type: any;
    upload(): any;
    initRequest(file: any, resolve: any, reject: any): Promise<void>;
}
