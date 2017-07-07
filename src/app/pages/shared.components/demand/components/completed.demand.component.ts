import {
    Component, ViewEncapsulation, Injector,
    OnInit, ViewChild, OnDestroy
} from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DepartmentService } from '../../../masterdata/department/components';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService, UtilityService, AuthModel
} from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ngx-bootstrap/modal';



@Component({
    selector: 'completed-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/completed.demand.view.html'
})
export class CompletedDemandComponent implements OnInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModal') public childModal: ModalDirective;


    completedDemands: DemandModelToView[] = [];
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
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public globalStateProxyOpen: GlobalStateService;
    demand: DemandModelToView = new DemandModelToView();
    /**
     * Creates an instance of CompletedDemandComponent.
     * @param {DemandService} demandService 
     * @param {DemandRemarkLogService} demandRemarkLogsService 
     * @param {GlobalStateService} globalState 
     * @param {DepartmentService} departmentService 
     * 
     * @memberOf CompletedDemandComponent
     */
    constructor(private demandService: DemandService, private injector: Injector,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private dataExchange: DataExchangeService<number>,
        private toastrConfig: ToastrConfig, private _router: Router) {
        //    this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    openDemandDetails(demandId: number): void {
        this.demand = this.completedDemands.find(x => x.DemandId == demandId);
        this.childModal.show();
    }

    getCompletedDemands(deptId, incidentId): void {
        this.demandService.GetCompletedDemands(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.completedDemands = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    cancelModal(): any {
        this.demand = new DemandModelToView();
        this.childModal.hide();
    }

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    createDemandTrailModel(demand: DemandModelToView, flag): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        let createdOn = new Date(demand.CreatedOn);
        let totaTime = createdOn.getTime() + Number(demand.ScheduleTime) * 60000;
        let scheduleClose: Date = new Date();
        scheduleClose.setTime(totaTime);
        this.demandTrail.Answers = "";
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequesterName = demand.RequestedBy;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = demand.TargetDepartmentName;
        this.demandTrail.ApproverDepartmentName = demand.ApproverDepartmentName;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsApproved = demand.IsApproved;
        this.demandTrail.IsCompleted = demand.IsCompleted;
        this.demandTrail.ScheduledClose = scheduleClose;
        this.demandTrail.IsClosed = flag;
        this.demandTrail.ClosedOn = flag ? new Date() : null;
        this.demandTrail.ClosedByDepartmentName = flag ? this.currentDepartmentName : null;
        this.demandTrail.IsRejected = demand.IsRejected;
        this.demandTrail.RejectedDate = flag ? null : new Date();
        this.demandTrail.RejectedByDepartmentName = flag ? null : this.currentDepartmentName;
        this.demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedBy = demand.CreatedBy;
        this.demandTrail.CreatedOn = demand.CreatedOn

        let date = new Date();
        let rej = "";
        if (!flag) {
            rej = "Rejected and status changed to: ";
        }
        let answer = '<div><p>' + rej + demand.DemandStatusDescription + '   <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
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
                console.log("error:  " + error);
                alert("Error occured during saving the remark");
            });
    };

    isClosedOrRejected(item: DemandModelToView): any {
        return (item.IsClosed == true || item.IsRejected == true);

    };

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = `Closed by ${this.currentDepartmentName}, ${demand.DemandTypeName} request for ${demand.TargetDepartmentName}. Request Details : ${demand.DemandDesc}. Request Code ${demand.DemandCode}`;
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = demand.TargetDepartmentName;
        this.communicationLog.RequesterType = "Demand";
        this.communicationLog.DemandId = demand.DemandId;
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
        if (this.completedDemands.length > 0) {
            let demandCompletion: DemandModel[] = this.completedDemands.filter(this.isClosedOrRejected).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                if (x.IsClosed) {
                    item.IsClosed = x.IsClosed;
                    item.ClosedBy = this.createdBy;
                    item.ClosedOn = new Date;
                    item.DemandStatusDescription = `Closed by ${this.createdByName} ( ${this.currentDepartmentName})`;
                    item.CommunicationLogs = this.SetCommunicationLog(x);
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x, true);
                }
                if (x.IsRejected) {
                    item.IsRejected = x.IsRejected;
                    item.IsCompleted = false;
                    item.RejectedBy = this.createdBy;
                    item.RejectedDate = new Date;
                    item.DemandStatusDescription = `Approved and pending with ${x.TargetDepartmentName}`;
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x, false);
                }
                return item;
            });
            if (demandCompletion.length == 0) {
                this.toastrService.error("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForClosure(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand updated successfully.', 'Success', this.toastrConfig);
                        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
                        this.globalStateProxyOpen.NotifyDataChanged('DemandCompleted', null);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }

        else {
            this.toastrService.error("There is no completed request.");
        }
    };


    ngOnInit() {

        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        if (this._router.url.indexOf("archivedashboard") > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");

        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        }
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;
        this.getDepartmentName(this.currentDepartmentId);

        this.getCurrentDepartmentName(this.currentDepartmentId);

        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private getDepartmentName(deptId): void {
        this.departmentService.Get(deptId)
            .subscribe((department: DepartmentModel) => {
                this.currentDepartmentName = department.DepartmentName;
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.currentDepartmentName = department.Key;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.getCurrentDepartmentName(this.currentDepartmentId);
    };

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }
}