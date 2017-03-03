import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ActionableModel } from './actionable.model';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService, IServiceInretface,
    RequestModel, WEB_METHOD, GlobalConstants,
    BaseModel
} from '../../../shared';

@Injectable()
export class ActionableService {
    private _dataService: DataService<ActionableModel>;
    private _batchDataService: DataService<ActionableModel>;

    /**
         * Creates an instance of ActionableService.
         * @param {DataServiceFactory} dataServiceFactory 
         * @memberOf ActionableService
         */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<ActionableModel>('Actionables', option);

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<ActionableModel>('', option);
    }

    GetAll(): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    GetAllOpenByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode,ParentCheckListId)')
            .Filter("CompletionStatus eq 'Open' and IncidentId eq " + incidentId + " and DepartmentId eq " + departmentId)
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    GetAllCloseByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode)')
            .Filter("CompletionStatus eq 'Close' and IncidentId eq " + incidentId + " and DepartmentId eq " + departmentId)
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    Update(entity: ActionableModel): Observable<ActionableModel> {
        let key: string = entity.ActionId.toString();

        return this._dataService.Patch(entity, key).Execute();
    }
    setRagColor(businessTimeStart?: Date, businessTimeEnd?: Date): string {
        if (businessTimeStart != undefined && businessTimeEnd != undefined) {
            let startTime: number = (new Date(businessTimeStart)).getTime();
            let endTime: number = (new Date(businessTimeEnd)).getTime();
            let totalTimeDifferenceInMilliSeconds: number = null;
            let _Adiff: number = null;
            let _Cdiff1: number = null;
            totalTimeDifferenceInMilliSeconds = endTime - startTime;
            _Adiff = ((totalTimeDifferenceInMilliSeconds / 1000) / 60);

            let datetimenow: Date = null;
            datetimenow = new Date();
            datetimenow.getTime();

            _Cdiff1 = ((datetimenow.getTime() - endTime) / 1000) / 60;
            if (_Cdiff1 >= _Adiff) {
                return "statusRed";
            }
            if (((_Adiff / 2) <= _Cdiff1) && _Cdiff1 < _Adiff) {
                return "statusAmber";
            }
            else if (_Cdiff1 < _Adiff / 2) {
                return "statusGreen";
            }
        }

    }

    BatchOperation(data: any[]): Observable<ResponseModel<BaseModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];

        data.forEach(x => {
            requests.push(new RequestModel<any>
                (`/odata/Actionables(${x.ActionId})`, WEB_METHOD.PATCH, x));
        });
        return this._batchDataService.BatchPost<BaseModel>(requests).Execute();
    }
}