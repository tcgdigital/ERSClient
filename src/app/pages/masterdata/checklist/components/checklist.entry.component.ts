import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    AbstractControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { ChecklistModel } from './checklist.model';
import { DepartmentModel, DepartmentService } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';
import { ChecklistService } from './checklist.service';
import { ResponseModel, DataExchangeService, BaseModel, UtilityService, GlobalStateService } from '../../../../shared';

@Component({
    selector: 'checklist-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/checklist.entry.view.html'
})
export class ChecklistEntryComponent implements OnInit {
    public form: FormGroup;

    checkListModel: ChecklistModel;
    checkListModelEdit: ChecklistModel;
    date: Date = new Date();
    activeCheckLists: ChecklistModel[] = [];
    activeDepartments: DepartmentModel[] = [];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    showAdd: Boolean = true;
    buttonValue: String = "";
    currentDepartmentId: number;

    constructor(formBuilder: FormBuilder,
        private departmentService: DepartmentService,
        private checkListService: ChecklistService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<ChecklistModel>, private globalState: GlobalStateService) {
        this.showAdd = false;
        this.buttonValue = "Add Checklist";
        this.checkListModel = new ChecklistModel();
        this.checkListModelEdit = new ChecklistModel();
    }

    mergeResponses(departmentId): void {
        let allChecklists: Observable<ResponseModel<ChecklistModel>>
            = this.checkListService.GetAllByDepartment(departmentId);
        // let activeChecklists: Observable<ResponseModel<ChecklistModel>>
        //     = this.checkListService.GetAllActiveCheckLists();
        let activeDepartments: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();
        let activeEmergencyTypes: Observable<ResponseModel<EmergencyTypeModel>>
            = this.emergencyTypeService.GetAll();

        Observable.merge(allChecklists, activeDepartments, activeEmergencyTypes)
            .subscribe(
            (response: ResponseModel<BaseModel>) => {
                if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'CheckListId')) {
                    this.activeCheckLists = <ChecklistModel[]>response.Records;
                    this.checkListModel.ParentCheckListId = this.activeCheckLists[0].CheckListId;
                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'DepartmentId')) {
                    this.activeDepartments = <DepartmentModel[]>response.Records;
                    this.checkListModel.DepartmentId = this.activeDepartments[0].DepartmentId;
                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'EmergencyTypeId')) {
                    this.activeEmergencyTypes = <EmergencyTypeModel[]>response.Records;
                    this.checkListModel.EmergencyTypeId = this.activeEmergencyTypes[0].EmergencyTypeId;
                }
            },
            (error) => { console.log(error); },
            () => {
                this.form = this.resetCheckListForm();
                this.initiateCheckListModel();
                this.dataExchange.Subscribe("checklistModelEdited", model => this.onCheckListEditSuccess(model));
            }
            );
    }


    ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.mergeResponses(this.currentDepartmentId);
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
        this.mergeResponses(this.currentDepartmentId);
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe("checklistModelEdited");
    }

    initiateCheckListModel(): void {
        this.checkListModel = new ChecklistModel();
        this.checkListModel.ActiveFlag = 'Active';
        this.checkListModel.CreatedBy = 1;
        this.checkListModel.CreatedOn = this.date;
    }

    formControlDirtyCheck() {
        this.checkListModelEdit = new ChecklistModel();
        this.checkListModelEdit.CheckListId = this.form.controls['CheckListId'].value;

        if (this.form.controls['CheckListCode'].touched) {
            this.checkListModelEdit.CheckListCode = this.form.controls['CheckListCode'].value;
        }
        if (this.form.controls['CheckListDetails'].touched) {
            this.checkListModelEdit.CheckListDetails = this.form.controls['CheckListDetails'].value;
        }
        if (this.form.controls['ParentCheckListId'].touched) {
            this.checkListModelEdit.ParentCheckListId = this.form.controls['ParentCheckListId'].value;
        }
        if (this.form.controls['Duration'].touched) {
            this.checkListModelEdit.Duration = this.form.controls['Duration'].value;
        }
        if (this.form.controls['DepartmentId'].touched) {
            this.checkListModelEdit.DepartmentId = this.form.controls['DepartmentId'].value;
        }
        if (this.form.controls['URL'].touched) {
            this.checkListModelEdit.URL = this.form.controls['URL'].value;
        }
        if (this.form.controls['EmergencyTypeId'].touched) {
            this.checkListModelEdit.EmergencyTypeId = this.form.controls['EmergencyTypeId'].value;
        }
        if (this.form.controls['Sequence'].touched) {
            this.checkListModelEdit.Sequence = this.form.controls['Sequence'].value;
        }
    }

    onSubmit(values: Object): void {
        if (this.checkListModel.CheckListId == 0) {//ADD REGION
            this.checkListModel.CheckListCode = this.form.controls['CheckListCode'].value;
            this.checkListModel.CheckListDetails = this.form.controls['CheckListDetails'].value;
            this.checkListModel.ParentCheckListId = this.form.controls['ParentCheckListId'].value;
            this.checkListModel.Duration = this.form.controls['Duration'].value;
            this.checkListModel.DepartmentId = this.form.controls['DepartmentId'].value;
            this.checkListModel.URL = this.form.controls['URL'].value;
            this.checkListModel.EmergencyTypeId = this.form.controls['EmergencyTypeId'].value;
            this.checkListModel.Sequence = this.form.controls['Sequence'].value;
            delete this.checkListModel['Active'];
            this.checkListService.Create(this.checkListModel)
                .subscribe((response: ChecklistModel) => {
                    this.dataExchange.Publish("checkListModelSaved", response);
                    this.resetCheckListForm();
                    this.initiateCheckListModel();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {//EDIT REGION
            if (this.form.dirty) {
                this.formControlDirtyCheck();
                this.checkListService.Update(this.checkListModelEdit)
                    .subscribe((response: ChecklistModel) => {
                        this.initiateCheckListModel();
                        this.dataExchange.Publish("checkListListReload", response);
                         this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
    }

    cancel(): void {
        this.resetCheckListForm();
        this.showAdd = false;
    }

    onCheckListEditSuccess(data: ChecklistModel): void {
        this.showAdd = true;
        this.initiateCheckListModel();
        this.checkListModel = data;
        this.form = this.resetCheckListForm(this.checkListModel);
    }

    showAddRegion(): void {
        this.showAdd = true;
    }

    private resetCheckListForm(checkList?: ChecklistModel): FormGroup {
        return new FormGroup({
            CheckListId: new FormControl(checkList ? checkList.CheckListId : 0),
            CheckListCode: new FormControl(checkList ? checkList.CheckListCode : '', [Validators.required, Validators.minLength(5)]),
            CheckListDetails: new FormControl(checkList ? checkList.CheckListDetails : '', [Validators.required, Validators.minLength(12)]),
            ParentCheckListId: new FormControl(checkList ? checkList.ParentCheckListId : this.activeCheckLists[0].CheckListId, [Validators.required, Validators.minLength(1)]),
            Duration: new FormControl(checkList ? checkList.Duration : 0, [Validators.required, Validators.minLength(1)]),
            DepartmentId: new FormControl(checkList ? checkList.DepartmentId : this.activeDepartments[0].DepartmentId, [Validators.required, Validators.minLength(1)]),
            URL: new FormControl(checkList ? checkList.URL : '', [Validators.required, Validators.minLength(12)]),
            EmergencyTypeId: new FormControl(checkList ? checkList.EmergencyTypeId : this.activeEmergencyTypes[0].EmergencyTypeId, [Validators.required, Validators.minLength(1)]),
            Sequence: new FormControl(checkList ? checkList.Sequence : 0, [Validators.required, Validators.minLength(12)])
        });
    }
}