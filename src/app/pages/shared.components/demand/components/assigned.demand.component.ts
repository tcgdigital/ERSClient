import {
    Component, ViewEncapsulation, OnDestroy, Injector,
    OnInit, AfterContentInit, ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService, UtilityService, AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'assigned-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/assigned.demand.view.html'
})
export class AssignedDemandComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModal') public childModal: ModalDirective;


    demands: DemandModelToView[] = [];
    demand: DemandModelToView = new DemandModelToView();
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncidentId: number;
    Remarks: string;
    demandRemarks: DemandRemarkLogModel[];
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    demandForRemarks: DemandModelToView;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public globalStateProxyOpen: GlobalStateService;
    /**
     * Creates an instance of AssignedDemandComponent.
     * @param {DemandService} demandService 
     * @param {DepartmentService} departmentService 
     * @param {DemandRemarkLogService} demandRemarkLogsService 
     * @param {GlobalStateService} globalState 
     * 
     * @memberOf AssignedDemandComponent
     */
    constructor(private demandService: DemandService, private injector: Injector,
        private departmentService: DepartmentService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<number>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        //  this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    openDemandDetails(demandId: number): void {
        this.demand = this.demands.find(x=>x.DemandId==demandId);
        this.childModal.show();
    }

    getAssignedDemands(deptId, incidentId): void {
        this.demandService.GetForAssignedDept(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demands = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

     cancelModal() : any {
        this.demand= new DemandModelToView();
        this.childModal.hide();
    }

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            if (this.demands && this.demands.length > 0) {
                this.demands.forEach(x => {
                    if (x.ClosedOn == null) {
                        let ScheduleTime: number = (Number(x.ScheduleTime) * 60000);
                        let CreatedOn: number = new Date(x.CreatedOn).getTime();
                        let CurrentTime: number = new Date().getTime();
                        let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                        let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                        if (percentage < 50) {
                            x.RagStatus = 'statusGreen';
                        } else if (percentage >= 100) {
                            x.RagStatus = 'statusRed';
                        }
                        else {
                            x.RagStatus = 'statusAmber';
                        }
                    }
                    else {
                        let ScheduleTime: number = (Number(x.ScheduleTime) * 60000);
                        let CreatedOn: number = new Date(x.CreatedOn).getTime();
                        let CurrentTime: number = new Date().getTime();
                        let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                        let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                        if (percentage < 50) {
                            x.RagStatus = 'statusGreen';
                        } else if (percentage >= 100) {
                            x.RagStatus = 'statusRed';
                        }
                        else {
                            x.RagStatus = 'statusAmber';
                        }
                    }
                });
            }
        });
    };

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    getCurrentDepartmentName(departmentId): string {
        return this.departments.find(x => { return x.DepartmentId == departmentId; }).DepartmentName;
    };

    getAllDepartments() {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.currentDepartmentName = this.getCurrentDepartmentName(this.currentDepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    createDemandTrailModel(demand: DemandModelToView, flag, OriginalDemand?: DemandModel): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        let description = flag ? `Completed by ${this.createdByName}( ${this.currentDepartmentName})` : demand.DemandStatusDescription;
        this.demandTrail.Answers = "";
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequiredLocation = demand.RequiredLocation;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = this.currentDepartmentName;
        this.demandTrail.ApproverDepartmentName = this.departments.some((x: DepartmentModel) => x.DepartmentId == demand.ApproverDeptId) ?
            this.departments.find((x: DepartmentModel) => x.DepartmentId == demand.ApproverDeptId).DepartmentName : null;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsCompleted = true;
        this.demandTrail.ScheduledClose = new Date();
        this.demandTrail.IsClosed = false;
        this.demandTrail.ClosedOn = null;
        this.demandTrail.DemandStatusDescription = description;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedOn = demand.CreatedOn

        let date = new Date();
        let answer = `<div><p>Request ${this.demandTrail.DemandStatusDescription} <strong>Date :</strong>  ${date.toLocaleString()} </p><div>`;
        if (!flag && (OriginalDemand != null)) {
            this.demandTrail.IncidentId = OriginalDemand.IncidentId;
            this.demandTrail.DemandTypeId = OriginalDemand.DemandTypeId;
            this.demandTrail.DemandCode = OriginalDemand.DemandCode;
            this.demandTrail.RequesterName = OriginalDemand.RequestedBy;
            this.demandTrail.RequesterType = OriginalDemand.RequesterType;
            this.demandTrail.IsApproved = OriginalDemand.IsApproved;
            this.demandTrail.ApprovedDt = OriginalDemand.ApprovedDt;
            this.demandTrail.IsCompleted = false;
            this.demandTrail.ScheduledClose = null;
            this.demandTrail.IsRejected = false;
            this.demandTrail.RejectedDate = null;
            answer = `<div><p> Request Edited By ${this.currentDepartmentName}  <strong>Date :</strong> ${date}  </p><div>`;

            if (OriginalDemand.ScheduleTime) {
                let minutesInt = parseInt(OriginalDemand.ScheduleTime);
                let d = new Date(OriginalDemand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                let editedDate = new Date(d);
                answer = answer + '<strong>Expected Resolution Time</strong> : ' + editedDate + '  ';
            }
        }

        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
    };

    openDemandRemarks(demand) {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    };

    cancelRemarkUpdate(): void {
        this.childModalRemarks.hide();
    };

    saveRemark(remarks): void {
        let demand: DemandModelToView = this.demandForRemarks;
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = this.currentDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                this.toastrService.success('Remark saved successfully.', 'Success', this.toastrConfig);
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = "";
            }, (error: any) => {
                console.log(`Error: ${error}`);
                alert("Error occured during saving the remark");
            });
    };

    isCompleted(item: DemandModelToView): any {
        return item.IsCompleted == true;

    };

    submit(): void {
        if (this.demands.length > 0) {
            let demandCompletion: DemandModel[] = this.demands.filter(this.isCompleted).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.ScheduledClose = new Date(),
                    item.ClosedByDepartmentId = this.currentDepartmentId;
                item.DemandStatusDescription = `Completed by ${this.currentDepartmentName}`,
                    item.IsCompleted = x.IsCompleted,
                    item.IsRejected = false;
                item.RejectedDate = null;
                item.RejectedBy = null;
                item.Remarks = x.Remarks;
                item.DemandTrails = this.createDemandTrailModel(x, true);
                return item;
            });

            if (demandCompletion.length == 0) {
                this.toastrService.error("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForCompletion(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand status updated successfully.', 'Success', this.toastrConfig);
                        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
                        this.globalStateProxyOpen.NotifyDataChanged('DemandAssigned', null);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
        else {
            this.toastrService.error("There is no request assigned.");
        }
    };

    ngOnInit(): any {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

        if (this._router.url.indexOf("archivedashboard") > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        }
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdByName = this.credential.UserName;


        this.getAllDepartments();

        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.currentDepartmentName = department.Key;
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    ngAfterContentInit(): any {
        this.setRagStatus();
    };
}