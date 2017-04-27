import {
    Component, ViewEncapsulation, OnDestroy,
    OnInit, AfterContentInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, GlobalStateService,
    UtilityService, KeyValue,AuthModel
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'approved-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/approved.demand.view.html'
})
export class ApprovedDemandComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;

    demandsForApproval: DemandModelToView[] = [];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncidentId: number;
    createdBy: number;
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    demandRemarks: DemandRemarkLogModel[];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    demandTrail: DemandTrailModel;
    credential: AuthModel;

    /**
     * Creates an instance of ApprovedDemandComponent.
     * @param {DemandService} demandService 
     * @param {DemandRemarkLogService} demandRemarkLogsService 
     * @param {GlobalStateService} globalState 
     * @param {DepartmentService} departmentService 
     * 
     * @memberOf ApprovedDemandComponent
     */
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.createdByName = 'Anwesha Ray';
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
    };

    getDemandsForApproval(deptId, incidentId): void {
        this.demandService.GetByApproverDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandsForApproval = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            this.demandsForApproval.forEach(x =>
                function () {
                    if (x.ClosedOn == undefined || x.ClosedOn == null) {
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

    openDemandRemarks(demand: DemandModelToView): void {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    };

    createDemandTrailModel(demand: DemandModelToView, flag, originalDemand?: DemandModel): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        this.demandTrail.Answers = '';
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.IncidentId = this.currentIncidentId;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequesterName = demand.RequestedBy;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = demand.TargetDepartmentName;
        this.demandTrail.ApproverDepartmentName = flag ? this.currentDepartmentName : null;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsApproved = demand.IsApproved;
        this.demandTrail.ApprovedDt = flag ? new Date() : null;
        this.demandTrail.IsCompleted = false;
        this.demandTrail.ScheduledClose = null;
        this.demandTrail.IsClosed = false;
        this.demandTrail.ClosedOn = null;
        this.demandTrail.IsRejected = demand.IsRejected;
        this.demandTrail.RejectedDate = flag ? null : new Date();
        this.demandTrail.RejectedByDepartmentName = flag ? null : this.currentDepartmentName;
        this.demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedBy = this.createdBy;
        this.demandTrail.CreatedOn = demand.CreatedOn

        let date = new Date();
        let answer = `<div><p> ${demand.DemandStatusDescription}   <strong>Date :</strong>  ${date.toLocaleString()}  </p><div>`;
        if (originalDemand != undefined) {
            this.demandTrail.DemandTypeId = originalDemand.DemandTypeId;
            this.demandTrail.DemandCode = originalDemand.DemandCode;
            this.demandTrail.IsRejected = false;
            this.demandTrail.IsApproved = false;
            this.demandTrail.ApprovedDt = null;
            this.demandTrail.RejectedDate = null;
            this.demandTrail.ContactNumber = originalDemand.ContactNumber;
            this.demandTrail.DemandStatusDescription = originalDemand.DemandStatusDescription;
            this.demandTrail.RequiredLocation = originalDemand.RequiredLocation;
            this.demandTrail.RequesterType = originalDemand.RequesterType;
            answer = `<div><p> Request Edited By ${this.demandTrail.RequesterDepartmentName} <strong>Date :</strong> ${date} </p><div>`;
            if (originalDemand.ScheduleTime) {
                var minutesInt = parseInt(originalDemand.ScheduleTime);
                var d = new Date(originalDemand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                var editedDate = new Date(d);
                answer = answer + `<strong>Expected Resolution Time</strong> : ${editedDate}`;
            }
        }
        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
    };

    cancelRemarkUpdate(): void {
        this.childModalRemarks.hide();
    };

    saveRemark(remarks): void {
        let demand: DemandModelToView = this.demandForRemarks;
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;
        this.RemarkToCreate.CreatedBy = +this.credential.UserId;
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = "";
            }, (error: any) => {
                console.log(`Error: ${error}`);
                alert("Error occured during saving the remark");
            });
    };

    isApprovedOrRejected(item: DemandModelToView): any {
        return (item.IsApproved == true || item.IsRejected == true);
    };

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = `${demand.DemandStatusDescription}, ${demand.DemandTypeName} request for ${demand.TargetDepartmentName}. Request Details : ${demand.DemandDesc}.`;
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = demand.TargetDepartmentName;
        this.communicationLog.RequesterType = 'Request';
        this.communicationLog.DemandId = demand.DemandId;
        this.communicationLog.CreatedBy = +this.credential.UserId;
        this.communicationLog.InteractionDetailsType = GlobalConstants.InteractionDetailsTypeDemand;
        if (demand.AffectedPersonId != null) {
            this.communicationLog.AffectedPersonId = demand.AffectedPersonId;
        }
        else {
            delete this.communicationLog.AffectedPersonId;
        }
        if (demand.AffectedObjectId != null) {
            this.communicationLog.AffectedObjectId = demand.AffectedObjectId;
        }
        else {
            delete this.communicationLog.AffectedObjectId;
        }
        this.communicationLogs.push(this.communicationLog);
        return this.communicationLogs;
    };

    submit(): void {
        if (this.demandsForApproval.length > 0) {
            let demandCompletion: DemandModel[] = this.demandsForApproval.filter(this.isApprovedOrRejected).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.Remarks = x.Remarks;
                item.IsApproved = x.IsApproved;
                item.IsRejected = x.IsRejected;
                x.IsApproved ? item.ApprovedDt = new Date() : item.RejectedDate = new Date;
                x.IsApproved ? item.ApprovedBy = this.createdBy : item.RejectedBy = this.createdBy;
                item.ApproverDepartmentId = x.IsApproved ? this.currentDepartmentId : item.ApproverDepartmentId;
                item.DemandStatusDescription = item.IsApproved ? `Approved and pending with ${x.TargetDepartmentName}` :
                    `On Hold by ${this.currentDepartmentName}`;
                item.CommunicationLogs = this.SetCommunicationLog(x);
                item.DemandTrails = x.IsApproved ? this.createDemandTrailModel(x, true) : this.createDemandTrailModel(x, false);
                return item;
            });

            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForApproval(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand status successfully updated.', 'Success', this.toastrConfig);
                        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
    };

    ngOnInit(): any {
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        this.getCurrentDepartmentName(this.currentDepartmentId);
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
         this.currentDepartmentName = department.Key;
    };

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngAfterContentInit(): any {
        this.setRagStatus();
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}
