import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ActionableModel } from './actionable.model';
import { IActionableService } from './IActionableService';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService, IServiceInretface,
    RequestModel, WEB_METHOD, GlobalConstants,
    ServiceBase, BaseModel
} from '../../../../shared';

@Injectable()
export class ActionableService extends ServiceBase<ActionableModel> implements IActionableService {
    private _batchDataService: DataService<ActionableModel>;
    private _actionables: ResponseModel<ActionableModel>;
    public departmentIds: number[];
    public subDepartmentProjection: string;
    /**
     * Creates an instance of ActionableService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf ActionableService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private departmentService: DepartmentService) {
        super(dataServiceFactory, 'Actionables');
        let option: DataProcessingService = new DataProcessingService();

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<ActionableModel>('', option);
    }

    public GetAll(): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    public GetAllByIncident(incidentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($expand=TargetDepartment)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active'`)
            .OrderBy("CreatedOn desc")
            .Execute();

    }

    public GetAllByIncidentandSubDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        this.departmentIds = [];
        return this.departmentService.GetAllActiveSubDepartments(departmentId)
            .map((departmentResponse: ResponseModel<DepartmentModel>) => {
                this.subDepartmentProjection = '';
                departmentResponse.Records.forEach((itemDepartment: DepartmentModel, index: number) => {
                    this.departmentIds.push(itemDepartment.DepartmentId);
                    if (index == 0) {
                        this.subDepartmentProjection = `DepartmentId eq ${itemDepartment.DepartmentId}`;
                    }
                    else {
                        this.subDepartmentProjection = this.subDepartmentProjection + `or DepartmentId eq ${itemDepartment.DepartmentId}`;
                    }
                });
            })
            .flatMap((x) => {
                if (this.subDepartmentProjection == '') {
                    return Observable.of();
                }
                else {
                    return this._dataService.Query()
                        .Expand('CheckList($expand=TargetDepartment)')
                        .Filter(`IncidentId eq ${incidentId} and ${this.subDepartmentProjection} and ActiveFlag eq 'Active'`)
                        .OrderBy("CreatedOn desc")
                        .Execute()
                }

            });
    }

    public GetAllOpenByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode,ParentCheckListId)')
            .Filter(`CompletionStatus eq 'Open' and IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .OrderBy("CreatedOn desc")
            .Execute()
            .map((actionables: ResponseModel<ActionableModel>) => {
                this._actionables = actionables;
                this._actionables.Records.forEach(element => {
                    element.Active = (element.ActiveFlag == 'Active');
                    element.Done = false;
                    // element.IsDisabled = false;
                    element.show = false;
                    // if (element.CheckList.ParentCheckListId != null) {
                    //   element.IsDisabled = true;
                    //}
                    element.RagColor = this.setRagColor(element.AssignedDt, element.ScheduleClose);
                });
                return actionables;
            });
    }

    public GetAllOpenByIncidentId(incidentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`CompletionStatus eq 'Open' and IncidentId eq ${incidentId} and ParentCheckListId ne null`)
            .Select('ParentCheckListId')
            .Execute();
    }

    public GetChildActionables(checklistId, incidentId): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`ParentCheckListId eq ${checklistId} and IncidentId eq ${incidentId}`)
            .Select('ActionId,Description,ScheduleClose,ActualClose,ActionId,DepartmentId')
            .Execute();

    }
    public GetAllCloseByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode)')
            .Filter(`CompletionStatus eq 'Close' and IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .OrderBy("CreatedOn desc")
            .Execute()
            .map((actionables: ResponseModel<ActionableModel>) => {
                this._actionables = actionables;
                this._actionables.Records.forEach(element => {
                    element.Active = (element.ActiveFlag == 'Active');
                });

                return actionables;
            });
    }

    public Update(entity: ActionableModel): Observable<ActionableModel> {
        let key: string = entity.ActionId.toString();
        return this._dataService.Patch(entity, key).Execute();
    }

    public setRagColor(businessTimeStart?: Date, businessTimeEnd?: Date): string {
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

    public BatchOperation(data: any[]): Observable<ResponseModel<BaseModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];

        data.forEach(x => {
            requests.push(new RequestModel<any>
                (`/odata/Actionables(${x.ActionId})`, WEB_METHOD.PATCH, x));
        });
        return this._batchDataService.BatchPost<BaseModel>(requests).Execute();
    }

    public GetOpenActionableCount(incidentId: number, departmentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and CompletionStatus eq 'Open'`)
            .Execute();
    }


    public GetCloseActionableCount(incidentId: number, departmentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and CompletionStatus eq 'Close'`)
            .Execute();
    }

    public GetPendingOpenActionableForIncidentAndDepartment(incidentId:number,departmentId:number):Observable<ResponseModel<ActionableModel>>{
        return this._dataService.Query()
        .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and ClosedOn eq null and ReopenedOn eq null or ReopenedOn ne null`)
        .Execute();
    }

    
}