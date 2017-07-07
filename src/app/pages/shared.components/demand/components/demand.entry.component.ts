import {
    Component, ViewEncapsulation, Output, Injector,
    EventEmitter, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandModel } from './demand.model';
import { DemandTrailModel } from './demand.trail.model';
import { DemandTypeService, DemandTypeModel } from '../../../masterdata/demandtype';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { PageService, PageModel } from '../../../masterdata/department.functionality';
import {
    AffectedObjectsService, AffectedObjectsToView, AffectedPeopleService,
    AffectedPeopleToView, InvolvePartyModel, CommunicationLogModel
} from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
import { CallerService, CallerModel } from '../../caller';
import {
    ResponseModel, DataExchangeService, FileUploadService,
    GlobalConstants, KeyValue, AutocompleteComponent,
    UtilityService, GlobalStateService, AuthModel, DateTimePickerOptions
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment/moment';
import { DateTimePickerSelectEventArgs } from '../../../../shared/directives/datetimepicker';
import { FileStoreModel } from '../../../../shared/models/file.store.model';
import { FileStoreService } from '../../../../shared/services/common.service';



@Component({
    selector: 'demand-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demand.entry.view.html'
})
export class DemandEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('inputFileDemand') inputFileDemand: any;

    public form: FormGroup;
    datepickerOption: DateTimePickerOptions = new DateTimePickerOptions();
    demandModel: DemandModel = new DemandModel();
    demandTypes: DemandTypeModel[];
    date: Date = new Date();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    requesterTypes: any[] = GlobalConstants.RequesterType;
    filtereddepartments: DepartmentModel[] = [];
    affectedPeople: AffectedPeopleToView[] = [];
    affectedObjects: AffectedObjectsToView[] = [];
    pdas: KeyValue[] = [];
    awbs: KeyValue[] = [];
    currentIncidentId: number;
    currentOrganizationId: number;
    currentDepartmentId: number;
    parentDeptId: number = null;
    currentDepartmentName: string = 'Command Centre';
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    showAdd: boolean = true;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    buttonValue: string = '';
    createdBy: number;
    demandModelEdit: DemandModel;
    credentialName: string;
    caller: CallerModel;
    credential: AuthModel;
    isReadonly: boolean = false;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    resolutionTime: Date;
    submitted: boolean = false;
    filesToUpload: File[] = [];
    demandFilePath: string;
    demandFileName: string;
    public globalStateProxyOpen: GlobalStateService;
    public freshDemand: boolean = true;
    public isrejected: boolean = false;

    /**
     * Creates an instance of DemandEntryComponent.
     * @param {DemandService} demandService
     * @param {DemandTypeService} demandTypeService
     * @param {DepartmentService} departmentService
     * @param {PageService} pageService
     * @param {DemandTrailService} demandTrailService
     * @param {CallerService} callerService
     * @param {InvolvePartyService} involvedPartyService
     * @param {AffectedObjectsService} affectedObjectsService
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {GlobalStateService} globalState
     * @param {DataExchangeService<number>} dataExchange
     *
     * @memberOf DemandEntryComponent
     */
    constructor(private demandService: DemandService,
        private demandTypeService: DemandTypeService, private injector: Injector,
        private departmentService: DepartmentService,
        private pageService: PageService,
        private demandTrailService: DemandTrailService,
        private callerService: CallerService,
        private involvedPartyService: InvolvePartyService,
        private affectedObjectsService: AffectedObjectsService,
        private affectedPeopleService: AffectedPeopleService,
        private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<number>,
        private fileUploadService: FileUploadService,
        private toastrService: ToastrService,
        private fileStoreService: FileStoreService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        this.showAdd = false;
        this.buttonValue = 'Create Demand';
        this.departments = [];
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    getDemandType(): void {
        this.demandTypeService.GetAll()
            .subscribe((response: ResponseModel<DemandTypeModel>) => {
                this.demandTypes = response.Records.filter(x => x.ActiveFlag == 'Active');
                this.demandModel.DemandTypeId = (this.demandModel.DemandTypeId == 0)
                    ? this.demandTypes[0].DemandTypeId
                    : this.demandModel.DemandTypeId;
            });
    };

    getFileDetails(e: any): void {
        this.filesToUpload = [];
        for (var i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();
            if (extension !== 'exe' && extension !== 'dll')
                this.filesToUpload.push(e.target.files[i]);
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.inputFileDemand.nativeElement.value = '';
            }
        }
    }

    getPageSpecifiedDepartments(): void {
        this.pageService.GetDepartmentsByPageCode('ViewDepartmentSpecificDemands')
            .subscribe((response: ResponseModel<PageModel>) => {
                let pagePermissions = UtilityService.pluck(response.Records[0], ['PagePermissions'])[0];
                pagePermissions.forEach(x => {
                    this.departments.push(UtilityService.pluck(x, ['Department'])[0]);
                });
                this.demandModel.TargetDepartmentId = (this.demandModel.TargetDepartmentId == 0)
                    ? this.departments[0].DepartmentId
                    : this.demandModel.TargetDepartmentId;
            });
    };

    getAllDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, (error: any) => {
                console.log('error:  ' + error);
            });
    }

    createDemandTrailModel(demand: DemandModel, demandForAnswer: DemandModel, flag): DemandTrailModel[] {
        let demandTrails: DemandTrailModel[] = [];
        let demandTrail: DemandTrailModel = new DemandTrailModel();
        let editedFields = '';
        let answer = '';
        let descchanged = '';

        demandTrail.Answers = '';
        demandTrail.IncidentId = demand.IncidentId;
        demandTrail.DemandTypeId = demand.DemandTypeId;
        demandTrail.DemandCode = demand.DemandCode;
        demandTrail.ScheduleTime = demand.ScheduleTime;
        demandTrail.ContactNumber = demand.ContactNumber;
        demandTrail.Priority = demand.Priority;
        demandTrail.RequiredLocation = demand.RequiredLocation;
        demandTrail.RequesterName = demand.RequestedBy;
        demandTrail.RequesterDepartmentName = this.departments
            .some((x) => x.DepartmentId === demand.RequesterDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.RequesterDepartmentId).DepartmentName : null;
        demandTrail.RequesterParentDepartmentName = this.departments
            .some((x) => x.DepartmentId === demand.RequesterParentDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.RequesterParentDepartmentId).DepartmentName : null;
        demandTrail.TargetDepartmentName = this.departments.find((x) => x.DepartmentId === demand.TargetDepartmentId).DepartmentName;
        demandTrail.ApproverDepartmentName = this.departments.some((x) => x.DepartmentId === demand.ApproverDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.ApproverDepartmentId).DepartmentName : null;
        demandTrail.RequesterType = demand.RequesterType;
        demandTrail.DemandDesc = demand.DemandDesc;
        demandTrail.IsApproved = demand.IsApproved;
        demandTrail.ApprovedDt = demand.ApprovedDt;
        demandTrail.IsCompleted = false;
        demandTrail.ScheduledClose = null;
        demandTrail.IsClosed = false;
        demandTrail.ClosedOn = null;
        demandTrail.IsRejected = false;
        demandTrail.RejectedDate = null;
        demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        demandTrail.Remarks = demand.Remarks;
        demandTrail.ActiveFlag = "Active";
        demandTrail.CreatedBy = demand.CreatedBy ? demand.CreatedBy : this.createdBy;
        demandTrail.CreatedOn = demand.CreatedOn ? demand.CreatedOn : new Date();

        let TargetDepartmentName = this.departments.some(x => x.DepartmentId == demandForAnswer.TargetDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demandForAnswer.TargetDepartmentId).DepartmentName : undefined;
        let date = new Date();

        if (flag) {
            answer = `<p>${demand.DemandStatusDescription} <strong>Date :</strong>  ${date.toLocaleString()} `;
        }
        else {
            answer = `<p>Demand Edited By ${demandTrail.RequesterName} ( ${demandTrail.RequesterDepartmentName} ) <strong>Date :</strong>  ${date.toLocaleString()} `;
        }
        if (!flag && (demandForAnswer != undefined)) {

            if (demandForAnswer.Priority) {
                editedFields = editedFields + `<strong>Priority</strong> : ${demandForAnswer.Priority} `;
            }
            if (demandForAnswer.DemandDesc) {
                editedFields = editedFields + `<strong>Description</strong> : ${demandForAnswer.DemandDesc} `;
            }
            if (demandForAnswer.RequesterType) {
                editedFields = editedFields + `<strong>Requester Type</strong> : ${demandForAnswer.RequesterType} `;
            }
            if (demandForAnswer.TargetDepartmentId) {
                editedFields = editedFields + `<strong>Target Department</strong> : ${TargetDepartmentName} `;
            }
            if (demandForAnswer.ContactNumber) {
                editedFields = editedFields + `<strong>Requester Contact Number</strong> : ${demandForAnswer.ContactNumber} `;
            }
            if (demandForAnswer.ScheduleTime) {
                let minutesInt = parseInt(demandForAnswer.ScheduleTime);
                let d = new Date(demand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                let editedDate = new Date(d);
                editedFields = editedFields + `<strong>Expected Resolution Time</strong> : ${editedDate} `;
            }
            if (demandForAnswer.RequiredLocation) {
                editedFields = editedFields + `<strong>Required At Location</strong> : ${demandForAnswer.RequiredLocation} `;
            }

            if (demandForAnswer.DemandStatusDescription != undefined  &&  demandForAnswer.DemandStatusDescription.length > 0) {
                descchanged = `. ${demandForAnswer.DemandStatusDescription}.`;
            }
        }

        answer = answer + editedFields;
        if (descchanged.length > 0) {
            answer = answer + descchanged + '</p>';
        }
        else {
            answer = answer + '</p>';
        }

        demandTrail.Answers = answer;
        if ((!editedFields && flag) || (!flag && editedFields)) {
            demandTrails.push(demandTrail);
        }
        return demandTrails;
    };

    getPassengersCrews(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    getCargo(currentIncident): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ChangeAffectedPeople(): void {
        this.demandModel.AffectedPersonId = this.form.controls["AffectedPersonId"].value;
        if (this.demandModel.AffectedPersonId != 0) {
            this.form.controls["AffectedObjectId"].reset({ value: '', disabled: true });
            this.demandModel.PDATicketNumber = this.affectedPeople
                .find(x => x.AffectedPersonId == this.demandModel.AffectedPersonId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls["AffectedObjectId"].reset({ value: '', disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }
    };

    ChangeAffectedObjects(): void {
        this.demandModel.AffectedObjectId = this.form.controls["AffectedObjectId"].value;
        if (this.demandModel.AffectedObjectId != 0) {
            this.form.controls["AffectedPersonId"].reset({ value: '', disabled: true });
            this.demandModel.PDATicketNumber = this.affectedObjects
                .find(x => x.AffectedObjectId == this.demandModel.AffectedObjectId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls["AffectedPersonId"].reset({ value: '', disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }
    };

    showAddRegion(ShowAdd: Boolean): void {

        this.showAdd = true;
        this.buttonValue = "Create Demand";
        this.resetForm();
        this.demandModel.DemandId = 0;
        this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId = 0;
        this.demandModel.Priority = "0";
        this.demandModel.RequesterType = "";
        this.demandModel.TargetDepartmentId = 0;
        this.demandModel.Caller = new CallerModel();
        this.demandModel.RequestedBy = this.credentialName;
        this.demandModel.Caller.FirstName = this.credentialName;

        this.demandModel.Caller.LastName = "";
        this.Action = "Submit";
        this.freshDemand = true;
        this.isReadonly = false;
        this.childModal.show();
    };

    setModelFormGroup(model: DemandModel, isDisable: boolean, ...params: ((entity: DemandModel) => any)[]): void {
        let paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    this.form.controls[x].reset({ value: model[x].toString(), disabled: isDisable });
                })
            }
        }
    };

    setModelForUpdate(id) {
        this.demandService.GetByDemandId(id)
            .subscribe((response: ResponseModel<DemandModel>) => {

                this.freshDemand = false;
                //freshDemand
                this.demandModel = response.Records[0];
                this.isrejected = this.demandModel.IsRejected;
                // if (this.demandModel.DemandStatusDescription.indexOf('New Request by') > -1) {
                if ((this.demandModel.ApprovedBy == null && this.demandModel.IsCompleted == false) || this.demandModel.IsRejected == true) {
                    this.freshDemand = true;
                }
                this.setModelFormGroup(response.Records[0], false, x => x.DemandId, x => x.DemandTypeId,
                    x => x.Priority, x => x.DemandDesc, x => x.RequesterType,
                    x => x.PDATicketNumber, x => x.TargetDepartmentId, x => x.ContactNumber, x => x.RequiredLocation);

                let scheduleTime = response.Records[0].ScheduleTime;
                let createdOn = new Date(response.Records[0].CreatedOn);
                let timediff = createdOn.getTime() + (+scheduleTime) * 60000;

                let resolutiontime = new Date(timediff);
                //this.form.controls["ScheduleTime"].reset({ value: moment(resolutiontime).format('DD/MM/YYYY h:mm a'), disabled: false });
                this.form.controls["ScheduleTime"].reset({ value: moment(resolutiontime).format('DD-MMM-YYYY h:mm A'), disabled: false });
                this.caller = this.demandModel.Caller || new CallerModel();
                this.showAdd = true;
                this.buttonValue = "Create Demand";
                this.isReadonly = false;
                this.childModal.show();

                this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
                this.form.controls["AffectedPersonId"].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
                this.form.controls["AffectedObjectId"].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
                this.form.controls["DemandTypeId"].reset({ value: +this.demandModel.DemandTypeId, disabled: true });
                this.form.controls["RequestedBy"].reset({ value: this.caller.FirstName, disabled: false });


            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };


    showDemandDetails(id) {
        this.demandService.GetByDemandId(id)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandModel = response.Records[0];
                this.setModelFormGroup(response.Records[0], true, x => x.DemandId, x => x.DemandTypeId,
                    x => x.Priority, x => x.DemandDesc, x => x.RequestedBy, x => x.RequesterType,
                    x => x.PDATicketNumber, x => x.TargetDepartmentId, x => x.ContactNumber, x => x.RequiredLocation);

                let scheduleTime = response.Records[0].ScheduleTime;
                let createdOn = new Date(response.Records[0].CreatedOn);
                let timediff = createdOn.getTime() + (+scheduleTime) * 60000;
                let resolutiontime = new Date(timediff);
                //this.form.controls["ScheduleTime"].reset({ value: moment(resolutiontime).format('DD/MM/YYYY h:mm a'), disabled: true });
                this.form.controls["ScheduleTime"].reset({ value: moment(resolutiontime).format('DD-MMM-YYYY h:mm A'), disabled: true });
                this.caller = this.demandModel.Caller || new CallerModel();
                this.showAdd = true;
                this.isReadonly = true;
                this.childModal.show();
                this.submitted = false;
                this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
                this.form.controls["AffectedPersonId"].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
                this.form.controls["AffectedObjectId"].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
                this.form.controls["DemandTypeId"].reset({ value: this.demandModel.DemandTypeId, disabled: true });

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelModal(): void {
        this.childModal.hide();
        this.resetForm();
    }

    ngOnInit(): any {

        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentOrganizationId = +UtilityService.GetFromSession("CurrentOrganizationId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

        if (this._router.url.indexOf("archivedashboard") > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
            this.demandModel.IncidentId = this.currentIncidentId;
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
            this.demandModel.IncidentId = this.currentIncidentId;
            this.getPassengersCrews(this.currentIncidentId);
            this.getCargo(this.currentIncidentId);
        }

        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.credentialName = this.credential.UserName;
        this.datepickerOption.position = 'top left';
        this.datepickerOption.minDate = new Date();

        this.getDemandType();
        this.getPageSpecifiedDepartments();
        this.getAllDepartments();

        this.initializeForm();
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
        this.demandModel.DemandId = 0;

        this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId = 0;
        this.demandModel.Priority = "0";
        this.demandModel.RequesterType = "0";
        this.demandModel.TargetDepartmentId = 0;
        this.demandModel.Caller = new CallerModel();
        this.demandModel.RequestedBy = this.credentialName;
        this.demandModel.Caller.FirstName = this.credentialName;
        this.demandModel.Caller.LastName = "";
        this.Action = "Submit";
        this.isReadonly = false;

        this.dataExchange.Subscribe("OnDemandUpdate", model => this.setModelForUpdate(model));
        this.dataExchange.Subscribe("OnDemandDetailClick", model => this.showDemandDetails(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    };



    getDepartmentNameAndParentDepartment(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
                this.parentDeptId = response.ParentDepartmentId;
                this.demandModel.RequesterParentDepartmentId = this.parentDeptId;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    SetCommunicationLog(demand: DemandModel): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = demand.DemandStatusDescription + ", "
            + this.demandTypes.find(x => x.DemandTypeId == demand.DemandTypeId).DemandTypeName + " demand for " +
            this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName
            + ". Demand Details : " + demand.DemandDesc + ". ";

        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = this.currentDepartmentName;
        //  this.departments
        //     .find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName;
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

    initializeForm(): void {
        this.form = new FormGroup({
            DemandId: new FormControl({ value: 0, disabled: false }),
            DemandTypeId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            Priority: new FormControl({ value: '', disabled: false }, [Validators.required]),
            DemandDesc: new FormControl({ value: '', disabled: false }, [Validators.required]),
            RequestedBy: new FormControl({ value: this.credentialName, disabled: false }, [Validators.required]),
            RequesterType: new FormControl({ value: '', disabled: false }, [Validators.required]),
            PDATicketNumber: new FormControl({ value: '', disabled: true }),
            TargetDepartmentId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            ContactNumber: new FormControl({ value: '', disabled: false }, [Validators.required]),
            ScheduleTime: new FormControl({ value: '', disabled: false }),
            RequiredLocation: new FormControl({ value: '', disabled: false }, [Validators.required]),
            AffectedPersonId: new FormControl({ value: '', disabled: false }),
            AffectedObjectId: new FormControl({ value: '', disabled: false }),
            FileInputDemand: new FormControl()
        });
    };

    resetForm(): void {
        this.form.controls["DemandId"].reset({ value: 0, disabled: false });
        this.form.controls["DemandTypeId"].reset({ value: '', disabled: false });
        this.form.controls["Priority"].reset({ value: '', disabled: false });
        this.form.controls["DemandDesc"].reset({ value: '', disabled: false });
        this.form.controls["RequestedBy"].reset({ value: this.credentialName, disabled: false });
        this.form.controls["RequesterType"].reset({ value: '', disabled: false });
        this.form.controls["PDATicketNumber"].reset({ value: '', disabled: true });
        this.form.controls["TargetDepartmentId"].reset({ value: '', disabled: false });
        this.form.controls["ContactNumber"].reset({ value: '', disabled: false });
        this.form.controls["ScheduleTime"].reset({ value: '', disabled: false });
        this.form.controls["RequiredLocation"].reset({ value: '', disabled: false });
        this.form.controls["AffectedPersonId"].reset({ value: '', disabled: false });
        this.form.controls["AffectedObjectId"].reset({ value: '', disabled: false });
    }

    formControlDirtyCheck(): void {
        this.demandModelEdit = new DemandModel();
        delete this.demandModelEdit.ActiveFlag;
        delete this.demandModelEdit.CreatedBy;
        delete this.demandModelEdit.CreatedOn;
        delete this.caller.ActiveFlag;
        delete this.caller.CreatedBy;
        delete this.caller.CreatedOn;

        this.demandModelEdit.DemandId = this.form.controls['DemandId'].value;
        if (this.form.controls['Priority'].touched) {
            this.demandModelEdit.Priority = this.form.controls['Priority'].value;
        }
        if (this.form.controls['DemandDesc'].touched) {
            this.demandModelEdit.DemandDesc = this.form.controls['DemandDesc'].value;
        }
        if (this.form.controls['RequestedBy'].touched) {
            this.caller.FirstName = this.form.controls['RequestedBy'].value;
            // this.demandModelEdit.RequestedBy = this.form.controls['RequestedBy'].value;
        }
        if (this.form.controls['RequesterType'].touched) {
            this.demandModelEdit.RequesterType = this.form.controls['RequesterType'].value;
        }
        if (this.form.controls['TargetDepartmentId'].touched) {
            this.demandModelEdit.TargetDepartmentId = +this.form.controls['TargetDepartmentId'].value;
        }
        if (this.form.controls['ContactNumber'].touched) {
            this.demandModelEdit.ContactNumber = this.form.controls['ContactNumber'].value;
            this.caller.ContactNumber = this.form.controls['ContactNumber'].value;
        }
        if (this.form.controls['RequiredLocation'].touched) {
            this.demandModelEdit.RequiredLocation = this.form.controls['RequiredLocation'].value;
        }
        if (this.form.controls['FileInputDemand'].touched) {
            this.demandFileName = this.inputFileDemand.nativeElement.value;
        }
    }

    uploadFile(resolutionTimeChanged: boolean): void {
        if (this.filesToUpload.length) {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            //let param = this.credential.UserId;
            let organizationId = +UtilityService.GetFromSession("CurrentOrganizationId"); // To be changed by Dropdown when Demand table will change
            let moduleName = "Demand"
            let param = `${this.currentIncidentId}/${organizationId}/${this.currentDepartmentId}/${moduleName}`;
            this.date = new Date();
            this.fileUploadService.uploadFiles<string>(baseUrl + "./api/fileUpload/UploadFilesModuleWise/" + param,
                this.filesToUpload, this.date.toString()).subscribe((result: string) => {
                    console.log(result);

                    //this.demandFilePath = GlobalConstants.EXTERNAL_URL + result.substr(result.indexOf('UploadFiles'),result.length).replace(/\\/g,"/");
                    let fileStore: FileStoreModel = new FileStoreModel();
                    fileStore.FileStoreID = 0;
                    //delete fileStore.FileStoreID;
                    fileStore.IncidentId = this.currentIncidentId;
                    fileStore.DepartmentId = this.currentDepartmentId;
                    fileStore.OrganizationId = organizationId;
                    //fileStore.FilePath = this.demandFilePath;
                    fileStore.FilePath = result;
                    fileStore.UploadedFileName = this.filesToUpload[0].name;
                    if (this.demandModel.DemandId == 0) {
                        fileStore.DemandId = this.demandModel.DemandId;
                    }
                    else {
                        fileStore.DemandId = this.demandModelEdit.DemandId;
                    }
                    fileStore.ModuleName = moduleName;
                    fileStore.CreatedBy = +this.credential.UserId;
                    fileStore.CreatedOn = new Date();
                    fileStore.ActiveFlag = 'Active';

                    if (this.demandModel.DemandId == 0) {
                        this.demandModel.FileStores = [];
                        this.demandModel.FileStores.push(fileStore);
                        this.demandCreate();
                    }
                    else {
                        this.fileStoreService.Create(fileStore)
                            .subscribe((response: FileStoreModel) => {
                                console.log(response);
                                if (this.form.dirty) {
                                    this.demandUpdate(resolutionTimeChanged);
                                }
                                else {
                                    this.toastrService.success('Demand successfully updated.', 'Success', this.toastrConfig);
                                    this.dataExchange.Publish("DemandAddedUpdated", this.demandModelEdit.DemandId);
                                    this.initializeForm();
                                    this.demandModel = new DemandModel();
                                    this.showAdd = false;
                                    this.buttonValue = "Create Demand";
                                    this.childModal.hide();
                                    this.filesToUpload = [];
                                }
                            });
                    }
                });

        }
    }

    // getDemandPresentStatus(): void {
    //     [readonly] = "!freshDemand"
    // }
    addzero(num: number): string {
        let str: string = num.toString();
        if (num < 10) {
            str = "0" + str;
        }
        return str
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.valid) {
            if (this.demandModel.DemandId == 0) {
                UtilityService.setModelFromFormGroup<DemandModel>(this.demandModel, this.form, x => x.DemandId,
                    x => x.DemandTypeId, x => x.Priority, x => x.DemandDesc, x => x.RequesterType,
                    x => x.PDATicketNumber, x => x.TargetDepartmentId, x => x.ContactNumber,
                    x => x.RequiredLocation, x => x.ContactNumber);

                let now = new Date();
                let currentDate = now.getTime();
                let timeDiffSec = this.resolutionTime.getTime() - currentDate;
                let timediffMin = Math.floor(timeDiffSec / 60000);
                this.demandModel.ScheduleTime = timediffMin.toString();
                this.demandModel.DemandTypeId = +this.demandModel.DemandTypeId;
                this.demandModel.TargetDepartmentId = +this.demandModel.TargetDepartmentId;
                this.demandModel.Caller.FirstName = this.form.controls["RequestedBy"].value;
                this.demandModel.Caller.LastName = "";
                this.demandModel.Caller.ContactNumber = this.form.controls["ContactNumber"].value;
                this.demandModel.IncidentId = this.currentIncidentId;
                this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
                this.demandModel.DemandCode = "DEM-" + this.addzero(now.getSeconds()) + this.addzero(now.getMinutes()) + this.addzero(now.getHours()) +
                    this.addzero(now.getDate()) + this.addzero(now.getMonth() + 1) + now.getFullYear().toString();

                if (this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).IsAutoApproved) {
                    this.demandModel.IsApproved = true;
                    this.demandModel.ApproverDepartmentId = null;
                    this.demandModel.DemandStatusDescription = `New Demand (${this.demandModel.DemandCode}) created by ` +
                        this.demandModel.RequestedBy + " (" + this.currentDepartmentName + ")";
                }
                else {
                    this.demandModel.IsApproved = false;
                    let demandtypeitem: DemandTypeModel = this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId)
                    this.demandModel.DemandStatusDescription = `New Demand (${this.demandModel.DemandCode}) created by ` +
                        this.demandModel.RequestedBy + " (" + this.currentDepartmentName + "). " + 'Pending approval from ' + demandtypeitem.ApproverDepartment.DepartmentName;
                    this.demandModel.ApproverDepartmentId = demandtypeitem.DepartmentId;
                }


                if (this.demandModel.AffectedObjectId == 0) {
                    delete this.demandModel.AffectedObjectId;
                }
                if (this.demandModel.AffectedPersonId == 0) {
                    delete this.demandModel.AffectedPersonId;
                }
                this.demandModel.CommunicationLogs = this.SetCommunicationLog(this.demandModel);
                this.demandModel.DemandTrails = this.createDemandTrailModel(this.demandModel, this.demandModel, true);
                let resolutionTimeChanged = false;
                if (this.filesToUpload.length) {
                    this.uploadFile(resolutionTimeChanged);
                }

                else {
                    this.demandModel.FileStores = [];
                    this.demandCreate();
                }
            }
            else {
                this.formControlDirtyCheck();
                let resolutionTimeChanged = false;
                if (this.resolutionTime) {
                    this.demandService.GetByDemandId(this.demandModelEdit.DemandId)
                        .subscribe((response: ResponseModel<DemandModel>) => {
                            let createdOnDate = new Date(response.Records[0].CreatedOn);
                            let time = createdOnDate.getTime();
                            let timeDiffSec = this.resolutionTime.getTime() - time;
                            let timediffMin = Math.floor(timeDiffSec / 60000);
                            let scheduletime = timediffMin.toString();
                            this.demandModelEdit.ScheduleTime = scheduletime;
                            resolutionTimeChanged = true;
                            if (this.filesToUpload.length) {
                                this.uploadFile(resolutionTimeChanged);
                            }
                            else {
                                this.demandUpdate(resolutionTimeChanged);
                            }

                        });
                }
                else {
                    if (this.filesToUpload.length) {
                        this.uploadFile(resolutionTimeChanged);
                    }
                    else {
                        this.demandUpdate(resolutionTimeChanged);
                    }
                }
            }
        }
    };

    demandCreate(): void {
        this.demandService.Create(this.demandModel)
            .subscribe((response: DemandModel) => {
                this.toastrService.success('Demand successfully created.', 'Success', this.toastrConfig);
                //this.dataExchange.Publish("DemandAddedUpdated", response.DemandId);
                let num = UtilityService.UUID();
                this.globalStateProxyOpen.NotifyDataChanged('DemandAddedUpdated', num);
                this.initializeForm();
                this.demandModel = new DemandModel();
                this.showAdd = false;
                this.buttonValue = "Create Demand";
                this.submitted = false;
                this.childModal.hide();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    demandUpdate(resolutionTimeChanged): void {
        if (this.form.dirty || resolutionTimeChanged) {
            //  this.demandModelEdit.IsRejected=false;
            if (this.demandModel.IsRejected == true && !this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).IsAutoApproved) {
                let demandtypeitem: DemandTypeModel = this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId)
                this.demandModelEdit.IsRejected = false;
                this.demandModelEdit.DemandStatusDescription = 'Updated and Pending approval from ' + demandtypeitem.ApproverDepartment.DepartmentName;
            }
            // else {
            //     this.demandModel.IsApproved = false;
            //     let demandtypeitem: DemandTypeModel = this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId)
            //     this.demandModel.DemandStatusDescription = 'Pending approval from ' + demandtypeitem.ApproverDepartment.DepartmentName;
            //     this.demandModel.ApproverDepartmentId = demandtypeitem.DepartmentId;
            // }

            this.demandService.Update(this.demandModelEdit)
                .subscribe((response: DemandModel) => {
                    this.toastrService.success('Demand successfully updated.', 'Success', this.toastrConfig);
                    //this.dataExchange.Publish("DemandAddedUpdated", this.demandModelEdit.DemandId);
                    let num = UtilityService.UUID();
                    this.globalStateProxyOpen.NotifyDataChanged('DemandAddedUpdated', num);
                    let demandTrail = this.createDemandTrailModel(this.demandModel, this.demandModelEdit, false)[0];
                    demandTrail.DemandId = this.demandModel.DemandId;
                    this.freshDemand = false;
                    this.demandTrailService.Create(demandTrail)
                        .subscribe((response: DemandTrailModel) => { },
                        (error: any) => {
                            console.log("Error in demandTrail");
                        });
                    if (this.caller.CallerId != 0) {
                        this.callerService.Update(this.caller)
                            .subscribe((response: CallerModel) => { },
                            (error: any) => {
                                console.log("Error in demandTrail");
                            });
                    }
                    this.initializeForm();
                    this.demandModel = new DemandModel();
                    this.showAdd = false;
                    this.buttonValue = "Create Demand";
                    this.submitted = false;
                    this.childModal.hide();
                }, (error: any) => {
                    console.log("Error");
                });
        }
        else {
            this.submitted  =  false;
            this.childModal.hide();
        }
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        this.resolutionTime = new Date(date.SelectedDate.toString());
        this.form.get("ScheduleTime")
            .setValue(moment(this.resolutionTime).format('DD-MMM-YYYY hh:mm A'));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('OnDemandUpdate');
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPassengersCrews(this.currentIncidentId);
        this.getCargo(this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
    }
}
