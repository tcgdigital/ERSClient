import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ActionableModel } from './actionable.model';
import { IActionableService } from './IActionableService';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService, IServiceInretface,
    RequestModel, WEB_METHOD, GlobalConstants, ICompletionStatusType,
    ServiceBase, BaseModel, UtilityService
} from '../../../../shared';

@Injectable()
export class ActionableService extends ServiceBase<ActionableModel> implements IActionableService {
    private _batchDataService: DataService<ActionableModel>;
    private _actionables: ResponseModel<ActionableModel>;
    private _allActionables: ResponseModel<ActionableModel>;
    public departmentIds: number[];
    public subDepartmentProjection: string;
    public parentActionable: ActionableModel;
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
                departmentResponse.Records.map((itemDepartment: DepartmentModel, index: number) => {
                    this.departmentIds.push(itemDepartment.DepartmentId);
                    if (index == 0) {
                        this.subDepartmentProjection = `DepartmentId eq ${itemDepartment.DepartmentId}`;
                    }
                    else {
                        this.subDepartmentProjection = this.subDepartmentProjection + ` or DepartmentId eq ${itemDepartment.DepartmentId}`;
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
                        .Filter(`IncidentId eq ${incidentId} and (${this.subDepartmentProjection}) and ActiveFlag eq 'Active'`)
                        .OrderBy("CreatedOn desc")
                        .Execute()
                }
            });
    }

    public GetAllOpenByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode,ParentCheckListId)')
            .Filter(`CompletionStatus ne 'Closed' and IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .OrderBy("CreatedOn desc")
            .Execute()
            .map((actionables: ResponseModel<ActionableModel>) => {
                this._actionables = actionables;
                this._actionables.Records.forEach(element => {
                    element.Active = (element.ActiveFlag == 'Active');
                    element.Done = false;
                    element.show = false;
                    element.RagColor = UtilityService.GetRAGStatus('Checklist', element.AssignedDt, element.ScheduleClose);//this.setRagColor(element.AssignedDt, element.ScheduleClose);
                });
                return actionables;
            })
            .flatMap((actionables: ResponseModel<ActionableModel>) => this.GetAllByIncident(incidentId))
            .map((allActionables: ResponseModel<ActionableModel>) => {
                this._allActionables = allActionables;
                this._actionables.Records.map((element: ActionableModel) => {
                    if (element.ParentCheckListId == null) {

                        let allChildActionables: ActionableModel[] = this._allActionables.Records.filter((item: ActionableModel) => item.ParentCheckListId == element.ChklistId);
                        if (allChildActionables.length > 0) {
                            let globalStatus: ICompletionStatusType[] = [];
                            allChildActionables.map((elm: ActionableModel) => {
                                globalStatus.push(
                                    GlobalConstants.CompletionStatusType.find((itm: ICompletionStatusType) => {
                                        return (itm.caption == elm.CompletionStatus);
                                    }));
                            });
                            let itm: number = Math.min.apply(Math, globalStatus.map(function (o: ICompletionStatusType) { return +(o.value); }))
                            let consolidatedMinimumCompletionStatus: string = GlobalConstants.CompletionStatusType.find((item: ICompletionStatusType) => {
                                return (item.value == itm.toString());
                            }).caption;
                            element.CompletionStatus = consolidatedMinimumCompletionStatus;
                        }
                    }
                });
                return this._actionables;
            });
    }

    public SetParentActionableStatusByIncidentIdandDepartmentIdandActionable(incidentId: number,
        departmentId: number, actionable: ActionableModel,
        currentActionables: ActionableModel[]): void {
        console.log(actionable);
        if (actionable.ParentCheckListId != null) {
            this._dataService.Query()
                .Filter(`IncidentId eq ${incidentId} and ChklistId eq ${actionable.ParentCheckListId} and ActiveFlag eq 'Active'`)
                .Execute()
                .map((actionableResult: ResponseModel<ActionableModel>) => {
                    console.log(actionableResult);
                    this.parentActionable = actionableResult.Records[0];
                    return actionableResult;
                })
                .flatMap((actionableResult: ResponseModel<ActionableModel>) => this.GetChildActionables(this.parentActionable.ChklistId, incidentId))
                .subscribe((childActionables: ResponseModel<ActionableModel>) => {
                    console.log(childActionables);
                    if (childActionables.Count > 0) {
                        let globalStatus: ICompletionStatusType[] = childActionables.Records
                            .map((elm: ActionableModel) => {
                                let findExistingChildActionable: ActionableModel = currentActionables
                                    .find((item: ActionableModel) => elm.ActionId == item.ActionId);

                                if (findExistingChildActionable)
                                    elm.CompletionStatus = findExistingChildActionable.CompletionStatus;

                                return GlobalConstants.CompletionStatusType
                                    .find((itm: ICompletionStatusType) => itm.caption == elm.CompletionStatus);
                            });

                        let itm: number = Math.min.apply(Math, globalStatus.map((o: ICompletionStatusType) => +o.value));

                        let consolidatedMinimumCompletionStatus: string = GlobalConstants.CompletionStatusType
                            .find((item: ICompletionStatusType) => item.value == itm.toString()).caption;

                        let currentActionable: ActionableModel = currentActionables
                            .find((item: ActionableModel) => this.parentActionable.ActionId == item.ActionId);

                        currentActionable.CompletionStatus = consolidatedMinimumCompletionStatus;
                        currentActionable.Done = actionable.Done;
                    }

                });
        }
    }

    public GetAllOpenByIncidentId(incidentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`CompletionStatus ne 'Closed' and IncidentId eq ${incidentId} and ParentCheckListId ne null`)
            .Select('ParentCheckListId')
            .Execute();
    }

    public GetChildActionables(checklistId, incidentId): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`ParentCheckListId eq ${checklistId} and IncidentId eq ${incidentId}`)
            .Select('ActionId,Description,ScheduleClose,ActualClose,ActionId,DepartmentId,CompletionStatus')
            .Execute();

    }

    public GetAllCloseByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Expand('CheckList($select=CheckListId,CheckListCode)')
            .Filter(`CompletionStatus eq 'Closed' and IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
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

    public GetAllCloseByIncidentId(incidentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`CompletionStatus eq 'Closed' and IncidentId eq ${incidentId} and ParentCheckListId ne null`)
            .Select('ParentCheckListId')
            .Execute();
    }

    public Update(entity: ActionableModel): Observable<ActionableModel> {
        let key: string = entity.ActionId.toString();
        return this._dataService.Patch(entity, key).Execute();
    }

    public setRagColor(assignDate?: Date, scheduleClose?: Date): string {
        if (assignDate != undefined && scheduleClose != undefined) {
            let startTime: number = (new Date(assignDate)).getTime();
            let endTime: number = (new Date(scheduleClose)).getTime();
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

    public GetAssignActionableCount(incidentId: number, departmentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .Execute();
    }

    public GetOpenActionableCount(incidentId: number, departmentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and CompletionStatus ne 'Closed'`)
            .Execute();
    }

    public GetCloseActionableCount(incidentId: number, departmentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and CompletionStatus eq 'Closed'`)
            .Execute();
    }

    public GetPendingOpenActionableForIncidentAndDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId} and CompletionStatus ne 'Closed'`)
            .Execute();
    }

    public BatchGet(incidentId: number, departmentIds: number[]): Observable<ResponseModel<ActionableModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];
        let filterString: string = "";
        departmentIds.forEach((item, index) => {
            if (departmentIds.length > 1) {
                if (index == 0) {
                    filterString = `(DepartmentId eq ${item})`;
                }
                else {
                    filterString = filterString +
                        ` or (DepartmentId eq ${item})`;
                }
            }
            else {
                filterString = `filterString eq ${item}`;
            }
        });
        requests.push(new RequestModel<BaseModel>(`/odata/Actionables?$filter=IncidentId eq ${incidentId} and (${filterString})`, WEB_METHOD.GET));
        return this._batchDataService.BatchPost<BaseModel>(requests)
            .Execute();
    }
}