import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { DepartmentClosureModel } from './components/department.closure.model';
import { DepartmentClosureService } from './components/department.closure.service';

import { IncidentModel, IncidentService } from "../incident";
import {
    ResponseModel,
    DataExchangeService,
    Severity,
    KeyValue,
    IncidentStatus,
    GlobalStateService,
    UtilityService
} from '../../shared';

@Component({

    selector: 'department-closure-main',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles/department.closure.style.scss'],
    templateUrl: './views/department.closure.html'
})
export class DepartmentClosureComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    currentDepartmentId: number;
    currentIncidentId: number;
    public departmentClosureModel: DepartmentClosureModel;
    public departmentClosureModelSave: DepartmentClosureModel;
    public departmentClosureModelSubmit: DepartmentClosureModel;
    public isSubmited:boolean;
    constructor(formBuilder: FormBuilder, private globalState: GlobalStateService,
        private departmentClosureService: DepartmentClosureService, private toastrConfig: ToastrConfig,
        private toastrService: ToastrService) {
    }

    ngOnInit(): void {
        this.departmentClosureModel = new DepartmentClosureModel();
        this.FillFormControls(this.departmentClosureModel);
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.isSubmited=false;
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.initiateDepartmentClosureModel(this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('departmentChange');
        this.globalState.Unsubscribe('incidentChange');
    }

    private FillFormControls(departmentClosureModel: DepartmentClosureModel): void {
        this.form = new FormGroup({
            EmergencyName: new FormControl(departmentClosureModel.EmergencyName != '' ? departmentClosureModel.EmergencyName : ''),
            EmergencyInitiationNotes: new FormControl(departmentClosureModel.EmergencyNote != '' ? departmentClosureModel.EmergencyNote : ''),
            ClosureReport: new FormControl(departmentClosureModel.ClosureReport != '' ? departmentClosureModel.ClosureReport : ''),
            ClosureRemarks: new FormControl(departmentClosureModel.ClosureRemark != '' ? departmentClosureModel.ClosureRemark : '')
        });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private initializeObject(departmentClosureModel: DepartmentClosureModel, incidentModel: IncidentModel): void {
        departmentClosureModel = new DepartmentClosureModel();
        departmentClosureModel.DepartmentClosureId = 0;
        departmentClosureModel.DepartmentId = this.currentDepartmentId;
        departmentClosureModel.IncidentId = this.currentIncidentId;
        departmentClosureModel.EmergencyName = incidentModel.EmergencyName;
        departmentClosureModel.EmergencyNote = incidentModel.Description;
        departmentClosureModel.IsSubmitted = false;
        departmentClosureModel.SubmittedBy = null;
        departmentClosureModel.SubmittedOn = null;
        departmentClosureModel.IsSaved = false;
        departmentClosureModel.SavedBy = null;
        departmentClosureModel.SavedOn = null;
        departmentClosureModel.ActiveFlag = 'Active';
    }

    private initiateDepartmentClosureModel(incidentId: number): void {

        this.departmentClosureService.GetIncidentFromIncidentId(incidentId)
            .map((incidentResult: IncidentModel) => {
                this.departmentClosureModel = new DepartmentClosureModel();
                this.departmentClosureModel.DepartmentClosureId = 0;
                this.departmentClosureModel.DepartmentId = this.currentDepartmentId;
                this.departmentClosureModel.IncidentId = this.currentIncidentId;
                this.departmentClosureModel.EmergencyName = incidentResult.EmergencyName;
                this.departmentClosureModel.EmergencyNote = incidentResult.Description;
                this.departmentClosureModel.IsSubmitted = false;
                this.departmentClosureModel.SubmittedBy = null;
                this.departmentClosureModel.SubmittedOn = null;
                this.departmentClosureModel.IsSaved = false;
                this.departmentClosureModel.SavedBy = null;
                this.departmentClosureModel.SavedOn = null;
                this.departmentClosureModel.ActiveFlag = 'Active';
                this.FillFormControls(this.departmentClosureModel);
            })
            .flatMap(_ => this.departmentClosureService.GetAllByIncident(incidentId, this.currentDepartmentId))
            .subscribe((resultDepartmentClosureModel: ResponseModel<DepartmentClosureModel>) => {
                if (resultDepartmentClosureModel.Count > 0) {
                    if(resultDepartmentClosureModel.Records[0].IsSubmitted){
                        this.isSubmited=true;
                    }
                    let departmentClosure: DepartmentClosureModel = resultDepartmentClosureModel.Records[0];
                    this.departmentClosureModel.ClosureReport = departmentClosure.ClosureReport;
                    this.departmentClosureModel.ClosureRemark = departmentClosure.ClosureRemark;
                    this.FillFormControls(this.departmentClosureModel);
                }
            })
    }

    public onSave(): void {
        this.departmentClosureService.GetAllByIncident(this.currentIncidentId, this.currentDepartmentId)
            .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
                if (result.Count == 0) {
                    this.departmentClosureModelSave = new DepartmentClosureModel();
                    this.departmentClosureModelSave.DepartmentClosureId = 0;
                    this.departmentClosureModelSave.ClosureReport = this.form.controls['ClosureReport'].value;
                    this.departmentClosureModelSave.ClosureRemark = this.form.controls['ClosureRemarks'].value;
                    this.departmentClosureModelSave.IncidentId = this.currentIncidentId;
                    this.departmentClosureModelSave.DepartmentId = this.currentDepartmentId;
                    this.departmentClosureModelSave.IsSaved = true;
                    this.departmentClosureModelSave.SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                    this.departmentClosureModelSave.SavedOn = new Date();
                    this.departmentClosureModelSave.IsSubmitted = false;
                    this.departmentClosureModelSave.SubmittedBy = null;
                    this.departmentClosureModelSave.SubmittedOn = null;
                    this.departmentClosureModelSave.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                    this.departmentClosureModelSave.CreatedOn = new Date();
                    this.departmentClosureService.CreateDepartmentClosure(this.departmentClosureModelSave)
                        .subscribe((resultReturn: DepartmentClosureModel) => {
                            this.toastrService.success('The Department Closure Save is performed.', 'Department Closure', this.toastrConfig);
                        }, () => {
                            this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                        });
                }
                else {
                    result.Records[0].ClosureReport = this.form.controls['ClosureReport'].value;
                    result.Records[0].ClosureRemark = this.form.controls['ClosureRemarks'].value;
                    result.Records[0].IncidentId = this.currentIncidentId;
                    result.Records[0].DepartmentId = this.currentDepartmentId;
                    result.Records[0].IsSaved = true;
                    result.Records[0].SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                    result.Records[0].SavedOn = new Date();
                    result.Records[0].CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                    result.Records[0].CreatedOn = new Date();
                    delete result.Records[0].Department;
                    this.departmentClosureService.UpdateDepartmentClosure(result.Records[0])
                        .subscribe((resultReturn: DepartmentClosureModel) => {
                            this.toastrService.success('The Department Closure Save is performed.', 'Department Closure', this.toastrConfig);
                        }, () => {
                            this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                        });
                }
            });

    }

    public onSubmit(): void {
        this.departmentClosureService.CheckPendingCheckListOrDemandForIncidentAndDepartment(this.currentIncidentId, this.currentDepartmentId, (item: boolean) => {
            if (!item) {
                this.toastrService.warning('You can not submit the closure report since you have pending checklist or request.', 'Department Closure', this.toastrConfig);
                return false;
            }
            else {
                this.departmentClosureService.GetAllByIncident(this.currentIncidentId, this.currentDepartmentId)
                    .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
                        if (result.Count == 0) {
                            this.departmentClosureModelSubmit = new DepartmentClosureModel();
                            this.departmentClosureModelSubmit.DepartmentClosureId = 0;
                            this.departmentClosureModelSubmit.ClosureReport = this.form.controls['ClosureReport'].value;
                            this.departmentClosureModelSubmit.ClosureRemark = this.form.controls['ClosureRemarks'].value;
                            this.departmentClosureModelSubmit.IncidentId = this.currentIncidentId;
                            this.departmentClosureModelSubmit.DepartmentId = this.currentDepartmentId;
                            this.departmentClosureModelSubmit.IsSaved = true;
                            this.departmentClosureModelSubmit.SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                            this.departmentClosureModelSubmit.SavedOn = new Date();
                            this.departmentClosureModelSubmit.IsSubmitted = false;
                            this.departmentClosureModelSubmit.SubmittedBy = null;
                            this.departmentClosureModelSubmit.SubmittedOn = null;
                            this.departmentClosureModelSubmit.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                            this.departmentClosureModelSubmit.CreatedOn = new Date();
                            this.departmentClosureService.CreateDepartmentClosure(this.departmentClosureModelSubmit)
                                .subscribe((resultReturn: DepartmentClosureModel) => {
                                    this.isSubmited=true;
                                    this.toastrService.success('The Department Closure Submit is performed.', 'Department Closure', this.toastrConfig);
                                }, () => {
                                    this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                                });
                        }
                        else {
                            result.Records[0].ClosureReport = this.form.controls['ClosureReport'].value;
                            result.Records[0].ClosureRemark = this.form.controls['ClosureRemarks'].value;
                            result.Records[0].IncidentId = this.currentIncidentId;
                            result.Records[0].DepartmentId = this.currentDepartmentId;
                            result.Records[0].IsSaved = true;
                            result.Records[0].SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                            result.Records[0].SavedOn = new Date();
                            result.Records[0].CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                            result.Records[0].CreatedOn = new Date();
                            delete result.Records[0].Department;
                            this.departmentClosureService.UpdateDepartmentClosure(result.Records[0])
                                .subscribe((resultReturn: DepartmentClosureModel) => {
                                    this.isSubmited=true;
                                    this.toastrService.success('The Department Closure Submit is performed.', 'Department Closure', this.toastrConfig);
                                }, () => {
                                    this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                                });
                        }
                    });
            }
        });

    }

}