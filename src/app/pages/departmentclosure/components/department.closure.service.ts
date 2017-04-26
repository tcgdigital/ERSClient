import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IncidentModel, IncidentService } from "../../incident";
import { DepartmentClosureModel } from './department.closure.model';
import { IDepartmentClosureService } from './IDepartmentClosureService';
import { ActionableModel, ActionableService } from "../../shared.components/actionables";
import { DemandModel } from "../../shared.components/demand/components/demand.model";
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';


@Injectable()
export class DepartmentClosureService extends ServiceBase<DepartmentClosureModel> implements IDepartmentClosureService {

    private _departmentClosureService: DataService<DepartmentClosureModel>;
    public IsDepartmentClosureSubmit: boolean;
    private _dataServiceForDemand: DataService<DemandModel>;
    constructor(private dataServiceFactory: DataServiceFactory,
        private incidentService: IncidentService,
        private actionableService: ActionableService

    ) {
        super(dataServiceFactory, 'DepartmentClosures');
        let option: DataProcessingService = new DataProcessingService();

        this._dataServiceForDemand = this.dataServiceFactory.CreateServiceWithOptions<DemandModel>('Demands', option);
        this.IsDepartmentClosureSubmit = false;

    }

    public GetIncidentFromIncidentId(incidentId: number): Observable<IncidentModel> {
        return this.incidentService.GetIncidentById(incidentId);
    }

    public GetAllByIncident(incidentId: number, departmentId: number): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Expand("Department")
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .Execute();
    }

    public getAllbyIncidentandDepartment(incidentId, departmentId): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Select('ClosureReport,ClosureRemark')
            .Filter(`IncidentId eq ${incidentId}  and DepartmentId eq ${departmentId}`)
            .Execute();
    }

    public CreateDepartmentClosure(departmentClosure: DepartmentClosureModel): Observable<DepartmentClosureModel> {
        return this._dataService.Post(departmentClosure)
            .Execute();
    }

    public UpdateDepartmentClosure(entity: DepartmentClosureModel): Observable<DepartmentClosureModel> {
        let key: string = entity.DepartmentClosureId.toString()
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    public CheckPendingCheckListOrDemandForIncidentAndDepartment(incidentId: number, departmentId: number, callback?: ((_: boolean) => void)): void {
        this.actionableService.GetPendingOpenActionableForIncidentAndDepartment(incidentId, departmentId)
            .map((actionables: ResponseModel<ActionableModel>) => {
                this.IsDepartmentClosureSubmit = (actionables.Count > 0);
            })
            .flatMap((x) => this._dataServiceForDemand.Query()
                .Filter(`IncidentId eq ${incidentId} and TargetDepartmentId eq ${departmentId} and IsCompleted eq true`)
                .Execute())
            .subscribe((demands: ResponseModel<DemandModel>) => {
                this.IsDepartmentClosureSubmit = (demands.Count > 0);
                if (callback) {
                    callback(this.IsDepartmentClosureSubmit);
                }
            });
    }
}