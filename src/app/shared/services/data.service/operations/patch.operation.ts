import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for JSON based PATCH request
 *
 * @export
 * @class PatchOperation
 * @extends {(DataOperation<T | any>)}
 * @template T
 */
export class PatchOperation<T extends BaseModel | any> extends DataOperation<BaseModel | any> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private typeName: string,
        private entity: T,
        private key: string) {
        super(dataProcessingService, httpService, typeName, entity);
        this.Key = key;
        this.RequestHeaders = new Headers({
            'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
            'Accept': 'application/json; charset=utf-8; odata.metadata=none'
        });
    }

    /**
     * Execute PATCH request
     *
     * @returns {(Observable<T | any>)}
     *
     * @memberOf PatchOperation
     */
    public Execute(): Observable<T | any> {
        let body = JSON.stringify(this.entity);
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
            console.log(`Patch key: ${this.Key}`);
        let requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.PATCH, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.patch(uri, body, requestOps));
    }
}