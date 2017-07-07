import {
    Component, ViewEncapsulation, OnInit,
    AfterContentInit, ViewChild, OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment/moment';



import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';

import { DemandService } from './demand.service';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';

import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService, UtilityService, AuthModel, FileUploadService
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileStoreModel } from '../../../../shared/models/file.store.model';
import { FileStoreService } from '../../../../shared/services/common.service';

@Component({
    selector: 'my-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/mydemand.view.html'
})
export class MyDemandComponent implements OnInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModalTrail') public childModalTrail: ModalDirective;

    mydemands: DemandModelToView[] = [];
    currentDepartmentId: number;
    currentIncidentId: number;
    createdByName: string;
    createdBy: number;
    demandRemarks: DemandRemarkLogModel[] = [];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    demandTypeName: string = "";
    requesterDepartmentName: string = "";
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string

    /**
     * Creates an instance of MyDemandComponent.
     * @param {DemandService} demandService 
     * @param {DemandRemarkLogService} demandRemarkLogsService 
     * @param {DataExchangeService<number>} dataExchange 
     * @param {DemandTrailService} demandTrailService 
     * @param {GlobalStateService} globalState 
     * 
     * @memberOf MyDemandComponent
     */
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private dataExchange: DataExchangeService<number>,
        private demandTrailService: DemandTrailService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        this.demandForRemarks = new DemandModelToView();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
    }

    getMyDemands(deptId, incidentId): void {
        this.demandService.GetByRequesterDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                console.log(response);
                this.mydemands = this.demandService.DemandMapper(response.Records);
                console.log(this.mydemands);
                this.mydemands.forEach(x => {
                    let scheduleTime = x.ScheduleTime;
                    let createdOn = new Date(x.CreatedOn);
                    let timediff = createdOn.getTime() + (+scheduleTime) * 60000;
                    let resolutiontime = new Date(timediff);
                    x.ScheduleTimeToShow = moment(resolutiontime).format('DD-MMM-YYYY hh:mm A');
                    x["showRemarks"] = false;
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            if (this.mydemands && this.mydemands.length > 0) {
                this.mydemands.forEach(x => {
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


    open(demandId) {
        this.dataExchange.Publish("OnDemandUpdate", demandId);

    };

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    getDemandTrails(demandId): void {
        this.demandTrailService.getDemandTrailByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandTrailModel>) => {
                this.demandTrails = response.Records;
                this.childModalTrail.show();
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }

    cancelTrail(): void {
        this.childModalTrail.hide();
    }

    openDemandRemarks(demand) {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    };

    cancelRemarkUpdate(demand): void {
        this.childModalRemarks.hide();
    };

    saveRemark(remarks): void {
        let demand = this.demandForRemarks;

        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = demand.RequesterDepartmentName;
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

    openTrail(demand: DemandModelToView): void {
        this.demandTypeName = demand.DemandTypeName;
        this.requesterDepartmentName = demand.RequesterDepartmentName;
        this.getDemandTrails(demand.DemandId);
    };

    openDemandDetails(demandId: number): void {
        this.dataExchange.Publish("OnDemandDetailClick", demandId);
    }

    canceltrail(demand) {
        demand["showTrails"] = false;
    }

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
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;

        this.Remarks = "";

        this.globalState.Subscribe("DemandAddedUpdated", model => this.demandUpdated(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private demandUpdated(model): void {
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    }
    ngAfterContentInit(): any {
        this.setRagStatus();
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
        this.globalState.Unsubscribe('DemandAddedUpdated');
    }

}