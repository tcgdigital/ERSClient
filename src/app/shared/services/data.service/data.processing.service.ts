import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Response, RequestOptions } from '@angular/http';

import { BaseModel, ResponseModel, WEB_METHOD, RequestModel } from '../../models';
import { ODataKeyConfig } from './odata.keyconfig';
import { GlobalConstants } from '../../constants';
import { UtilityService } from '../common.service';

@Injectable()
export class DataProcessingService {
    public Key: ODataKeyConfig = new ODataKeyConfig();
    public EndPoint: string = GlobalConstants.ODATA;

    /**
     * Get base URI
     * 
     * @readonly
     * @private
     * @type {string}
     * @memberOf DataProcessingService
     */
    private get BaseUri(): string {
        return `${GlobalConstants.EXTERNAL_URL}${this.EndPoint}`;
    }

    /**
     * Generate and returns API or OData uri as per the parameter provided
     *
     * @param {string} typeName 'typeName represents OData or API controller name'
     * @param {string} [entityKey] 'entityKey can be number or guid which is optional parameter'
     * @param {string} [actionSuffix] 'actionSuffix represents custom API function name which is optional parameter'
     * @returns
     *
     * @memberOf DataOperation
     */
    public GetUri(typeName: string, entityKey: string = '', actionSuffix: string = '') {
        let uri: string = '';

        if (this.EndPoint === GlobalConstants.TOKEN || this.EndPoint === GlobalConstants.BATCH)
            uri = `${this.BaseUri}`;
        else {
            if (entityKey !== '') {
                // console.log(entityKey);
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityKey))
                    uri = `${this.BaseUri}/${typeName}('${entityKey}')`;
                else if (!/^[0-9]*$/.test(entityKey))
                    uri = `${this.BaseUri}/${typeName}(${entityKey})`;
                else
                    uri = `${this.BaseUri}/${typeName}(${entityKey})`;
            }
            else {
                if (actionSuffix !== '' && typeName !== '')
                    uri = `${this.BaseUri}/${typeName}/${actionSuffix}`;
                else if (actionSuffix !== '' && typeName === '')
                    uri = `${uri}/${actionSuffix}`;
                else
                    uri = `${this.BaseUri}/${typeName}`;
            }
        }
        return uri;
    }

    /**
     * Commoin error handler
     *
     * @param {*} error
     * @param {*} caught
     *
     * @memberOf DataOperation
     */
    public HandleError(error: any, caught: any = {}): void {
        let message: string = /api$/gi.test(this.BaseUri) ? 'API Error' : 'OData Error';
        console.warn(message, error, caught);
    }

    /**
     * Set new headers or merge existing headers
     *
     * @param {Headers} headers
     * @param {URLSearchParams} [params]
     * @returns {RequestOptions}
     *
     * @memberOf DataProcessingService
     */
    public SetRequestOptions(requestType: WEB_METHOD, headers: Headers, params?: URLSearchParams): RequestOptions {

        let _headers: Headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
            'Accept': 'application/json; charset=utf-8; odata.metadata=none'
        });

        let token: string = UtilityService.GetFromSession('access_token');
        if (token !== '' && requestType !== WEB_METHOD.SIMPLEPOST) {
            if (headers)
                headers.set('Authorization', `Bearer ${token}`);
            else
                headers = new Headers({ 'Authorization': `Bearer ${token}` });
        }

        let finalHeaders = Object.assign<Headers, Headers>(_headers, headers);
        // console.log(finalHeaders);

        let requestOptions: RequestOptions = new RequestOptions({
            headers: finalHeaders
        });

        if (params) requestOptions.search = params;
        return requestOptions;
    }

    /**
     * Extract data from OData or API responses
     *
     * @template T
     * @param {Response} response
     * @returns {T}
     *
     * @memberOf DataProcessingService
     */
    public ExtractQueryResult<T extends BaseModel | any>(response: Response): T {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entity: T | any = responseBody;
        return entity || null;
    }

    /**
     * Extract data collection from OData or API responses
     *
     * @template T
     * @param {Response} response
     * @returns {T[]}
     *
     * @memberOf DataOperation
     */
    public ExtractQueryResults<T extends BaseModel | any>(response: Response): T | any[] {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entities: T | any[] = (responseBody.value) ?
            <T | any[]>responseBody.values : <T | any[]>responseBody;
        return entities;
    }

    /**
     * Extract data collection and total record count from OData or API response
     *
     * @template T
     * @param {Response} response
     * @returns {ResponseModel<T>}
     *
     * @memberOf DataOperation
     */
    public ExtractQueryResultsWithCount<T extends BaseModel>(response: Response): ResponseModel<T> {
        let responseModel: ResponseModel<T> = new ResponseModel<T>();

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entities: T[] = (responseBody.value) ? <T[]>responseBody.value : <T[]>responseBody;
        responseModel.Records = entities;

        try {
            let count: number = parseInt(responseBody['@odata.count'], 10) || entities.length;
            responseModel.Count = count;
        } catch (error) {
            console.warn('Cannot determine response entities count. Falling back to collection length...');
            responseModel.Count = entities.length;
        }

        return responseModel;
    }

    /**
     * Extract data collection from Odata batch response
     *
     * @template T
     * @param {Response} response
     *
     * @memberOf DataProcessingService
     */
    public ExtractBatchQueryResults<T extends BaseModel>(response: Response): ResponseModel<T> {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }
        let responseModel: ResponseModel<T> = new ResponseModel<T>();
        let dataItems: T[] = [];
        let responseBody: string = response.text();
        let pattern: RegExp = new RegExp('--batchresponse_(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}', 'gi');

        let statusCodes: string[] = responseBody.match(/HTTP\/1\.1.*/gim); 
        if (statusCodes.length > 0) {
            responseModel.StatusCodes = statusCodes;
        }

        let responseItems: string[] = responseBody
            .split(pattern).filter((value: string, index: number) => {
                return value !== undefined && value !== '' && value !== '--';
            });

        if (responseItems && responseItems.length > 0) {
            responseItems.forEach((value: string, index: number) => {
                let jsonStartingPosition = value.indexOf('[');
                let jsonEndingPosition = value.lastIndexOf(']');

                if (jsonStartingPosition > 0 && jsonEndingPosition > 0) {
                    let responseJson = value.substr(jsonStartingPosition,
                        (jsonEndingPosition - jsonStartingPosition) + 1);

                    let item = JSON.parse(responseJson);
                    console.log(item);
                    dataItems.push(item);
                }
            });
        }
        responseModel.Records = dataItems;
        return responseModel;
    }

    /**
     * Generating body payload for batch operation
     * 
     * @template T
     * @param {T[]} requests
     * @returns {string}
     * 
     * @memberOf DataProcessingService
     */
    public GenerateBachBodyPayload<T extends RequestModel<BaseModel>>(requests: T[], uniqueId: string): string {
        let batchCommand: string[] = [];
        let batchBody: string;

        requests.filter((rq) => rq.Method === WEB_METHOD.GET)
            .forEach((rq, index) => {
                this.BatchQueryRequest(batchCommand, rq, index, uniqueId);
            });

        requests.filter((rq) => rq.Method !== WEB_METHOD.GET)
            .forEach((rq, index) => {
                this.BatchChangeRequest(batchCommand, rq, index, uniqueId);
            });

        batchBody = batchCommand.join('\r\n');

        batchCommand = new Array();
        batchCommand.push('--batch_' + uniqueId);
        batchCommand.push('Content-Type: multipart/mixed; boundary=changeset_' + uniqueId);
        batchCommand.push('Content-Length: ' + batchBody.length);
        batchCommand.push('Content-Transfer-Encoding: binary');
        batchCommand.push('');
        batchCommand.push(batchBody);
        batchCommand.push('');
        batchCommand.push('--batch_' + uniqueId + '--');

        batchBody = batchCommand.join('\r\n');
        return batchBody;
    }

    /**
     * Generating request payload block for (POST, PUT, PATCH) operation
     * 
     * @private
     * @template T
     * @param {string[]} batchCommand
     * @param {T} request
     * @param {number} batchIndex
     * @param {string} uniqueId
     * 
     * @memberOf DataProcessingService
     */
    private BatchChangeRequest<T extends RequestModel<BaseModel>>
        (batchCommand: string[], request: T, batchIndex: number, uniqueId: string) {

        let payload: string = JSON.stringify(request.Entity);
        batchCommand.push('--changeset_' + uniqueId);
        batchCommand.push('Content-Type: application/http');
        batchCommand.push('Content-Transfer-Encoding: binary');
        batchCommand.push('Content-ID: <' + uniqueId + '+' + (batchIndex + 1) + '>');
        batchCommand.push('');
        batchCommand.push(request.Method.toString() + ' ' + request.Url + ' HTTP/1.1');
        batchCommand.push('Content-Type: application/json; charset=utf-8');
        batchCommand.push('accept: application/json; charset=utf-8; odata.metadata=none');
        batchCommand.push('Authorization: Bearer ' + UtilityService.GetFromSession('access_token'))
        batchCommand.push('Content-Length: ' + payload.length.toString());
        batchCommand.push('');
        batchCommand.push(payload);
        batchCommand.push('');
    }

    /**
     * Generating request payload block for (GET) operation
     * 
     * @private
     * @template T
     * @param {string[]} batchCommand
     * @param {T} request
     * @param {number} batchIndex
     * @param {string} uniqueId
     * 
     * @memberOf DataProcessingService
     */
    private BatchQueryRequest<T extends RequestModel<BaseModel>>
        (batchCommand: string[], request: T, batchIndex: number, uniqueId: string) {
        batchCommand.push('--batch_' + uniqueId);
        batchCommand.push('Content-Type: application/http');
        batchCommand.push('Content-Transfer-Encoding: binary');
        batchCommand.push('Content-ID: <' + uniqueId + '+' + (batchIndex + 1) + '>');
        batchCommand.push('');
        batchCommand.push('GET ' + request.Url + ' HTTP/1.1');
        batchCommand.push('');
    }
}