import {
    Component, ViewEncapsulation, OnDestroy, Injector,
    OnInit, AfterContentInit, ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';


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
    UtilityService, KeyValue, AuthModel
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'approved-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/approved.demand.view.html'
})
export class ApprovedDemandComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModal') public childModal: ModalDirective;


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
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public globalStateProxyOpen: GlobalStateService;
    demand: DemandModelToView = new DemandModelToView();

    /**
     * Creates an instance of ApprovedDemandComponent.
     * @param {DemandService} demandService
     * @param {DemandRemarkLogService} demandRemarkLogsService
     * @param {GlobalStateService} globalState
     * @param {DepartmentService} departmentService
     *
     * @memberOf ApprovedDemandComponent
     */
    constructor(private demandService: DemandService, private injector: Injector,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private dataExchange: DataExchangeService<number>,
        private toastrConfig: ToastrConfig, private _router: Router) {
        //   this.createdByName = 'Anwesha ray';
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    getDemandsForApproval(deptId, incidentId): void {
        this.demandService.GetByApproverDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandsForApproval = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelModal(): any {
        this.demand = new DemandModelToView();
        this.childModal.hide();
    }

    setRagStatus(): void {
        Observable.interval(1000).subscribe((_) => {
            this.demandsForApproval.forEach((x) => {
                if (x.ClosedOn === undefined || x.ClosedOn == null) {
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
    }

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    openDemandRemarks(demand: DemandModelToView): void {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    }

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
        this.demandTrail.ActiveFlag = 'Active';
        this.demandTrail.CreatedBy = this.createdBy;
        this.demandTrail.CreatedOn = demand.CreatedOn;

        let date = new Date();
        let answer = `<div><p> ${demand.DemandStatusDescription}   <strong>Date :</strong>  ${date.toLocaleString()}  </p><div>`;

        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
    }

    cancelRemarkUpdate(): void {
        this.childModalRemarks.hide();
    }

    saveRemark(remarks): void {
        let demand: DemandModelToView = this.demandForRemarks;
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = this.currentDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;
        this.RemarkToCreate.CreatedBy = +this.credential.UserId;
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = '';
            }, (error: any) => {
                console.log(`Error: ${error}`);
                alert('Error occured during saving the remark');
            });
    }

    isApprovedOrRejected(item: DemandModelToView): any {
        return (item.IsApproved === true || item.IsRejected === true);
    }

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = `${demand.DemandStatusDescription}, ${demand.DemandTypeName} request for ${demand.TargetDepartmentName}. Demand Details : ${demand.DemandDesc}. Demand Code ${demand.DemandCode}`;
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = demand.TargetDepartmentName;
        this.communicationLog.RequesterType = 'Demand';
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
    }

    submit(): void {
        if (this.demandsForApproval.length > 0) {
            let demandCompletion: DemandModel[] = this.demandsForApproval.filter(this.isApprovedOrRejected).map((x) => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.Remarks = x.Remarks;
                item.IsApproved = x.IsApproved;
                item.IsRejected = x.IsRejected;
                x.IsApproved ? item.ApprovedDt = new Date() : item.RejectedDate = new Date();
                x.IsApproved ? item.ApprovedBy = this.createdBy : item.RejectedBy = this.createdBy;
                item.ApproverDepartmentId = x.IsApproved ? this.currentDepartmentId : item.ApproverDepartmentId;
                item.DemandStatusDescription = item.IsApproved ? `Approved by ${this.createdByName} (${this.currentDepartmentName}) and pending with ${x.TargetDepartmentName}` :
                    `Rejected by ${this.createdByName} (${this.currentDepartmentName})`;
                x.DemandStatusDescription = item.DemandStatusDescription;
                item.CommunicationLogs = this.SetCommunicationLog(x);
                item.DemandTrails = x.IsApproved ? this.createDemandTrailModel(x, true) : this.createDemandTrailModel(x, false);
                return item;
            });

            if (demandCompletion.length === 0) {
                this.toastrService.error('Please select at least one request');
            }
            else {
                this.demandService.UpdateBulkForApproval(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand status successfully updated.', 'Success', this.toastrConfig);
                        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
                        this.globalStateProxyOpen.NotifyDataChanged('DemandApproved', null);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
        else {
            this.toastrService.error('There is no request to be approved');
        }
    }

    ngOnInit(): any {

        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;

        this.getCurrentDepartmentName(this.currentDepartmentId);
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    ngAfterContentInit(): any {
        this.setRagStatus();
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    openDemandDetails(demandId: number): void {
        this.demand = this.demandsForApproval.find((x) => x.DemandId === demandId);
        this.childModal.show();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        this.currentDepartmentName = department.Key;
    }
}
