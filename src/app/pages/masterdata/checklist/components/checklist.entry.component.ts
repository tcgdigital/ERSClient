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
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { ChecklistModel, ChecklistMapper } from './checklist.model';
import { DepartmentModel, DepartmentService } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';
import { ChecklistService } from './checklist.service';
import {
    ResponseModel, DataExchangeService, BaseModel,
    UtilityService, GlobalStateService, KeyValue, AuthModel, URLValidator
} from '../../../../shared';

import {
    OrganizationModel,
    OrganizationService
} from "../../../shared.components/organization";
import * as _ from 'underscore';

//import { EmergencyLocationModel, EmergencyLocationService } from '../../emergencylocation'

@Component({
    selector: 'checklist-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/checklist.entry.view.html'
})
export class ChecklistEntryComponent implements OnInit {
    public form: FormGroup;
    public submitted: boolean = false;
    CheckListParents: ChecklistModel[] = [];
    checkListModel: ChecklistModel;
    checkListModelEdit: ChecklistModel;
    date: Date = new Date();
    activeCheckLists: ChecklistModel[] = [];
    activeDepartments: DepartmentModel[] = [];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    showAdd: boolean = true;
    listSelected: boolean;
    buttonValue: string = '';
    currentDepartmentId: number;
    currentDepartmentName: string;
    credential: AuthModel;
    activeOrganizations: OrganizationModel[] = [];
    selectedcount: number;
    IsChecked: boolean = false;
    parentdepartments: DepartmentModel[] = [];
    checkListParentDepartmentWise: ChecklistModel[] = [];
    parentChecklists: ChecklistModel[] = [];
    noDtaList: ChecklistModel[] = [];
    public allDepartments: DepartmentModel[] = [];
    selectedparentChecklistdetails: string = "";
    ParentDepartmentId: number;
    isSelected: boolean = false;
    oldparents: number[] = [];
    newparents: number[] = [];
    //AllStations: EmergencyLocationModel[] = [];

    constructor(formBuilder: FormBuilder,
        private departmentService: DepartmentService,
        private checkListService: ChecklistService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<ChecklistModel>,
        private globalState: GlobalStateService,
        private organizationService: OrganizationService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
        this.listSelected = false;
        this.buttonValue = 'Add Checklist';
        this.checkListModel = new ChecklistModel();
        this.checkListModelEdit = new ChecklistModel();
        //this.noDtaList.push(new DepartmentModel{'DepartmentName' : "No Department Selected"});
        let x: ChecklistModel = new ChecklistModel();
        x.CheckListCode = "No Checklist Selected.";
        x.CheckListDetails = "";
        this.noDtaList.push(x);
        // this.parentChecklists = this.noDtaList;
    }

    showList(): void {
        this.listSelected = !this.listSelected;
    }

    selectParentChecklist(checklistParent: ChecklistModel): void {
        checklistParent.IsSelected = !checklistParent.IsSelected;
        this.parentChecklists = [];
        if (this.CheckListParents.filter(x => x["IsSelected"] == true).length > 0) {
            this.CheckListParents.filter(x => x["IsSelected"] == true).map(y => {
                this.parentChecklists.push(Object.assign({}, y))
            });
            this.parentChecklists = this.addDepartmentName(this.parentChecklists);

        }

        else {
            this.parentChecklists = this.noDtaList;
        }
        this.selectedparentChecklistdetails = this.parentChecklists[0].CheckListDetails;
        this.selectedcount = this.checkListParentDepartmentWise.filter(x => x["IsSelected"] == true).length;
        this.isSelected = this.checkListParentDepartmentWise.length == this.selectedcount;
    }

    addDepartmentName(x: ChecklistModel[]): ChecklistModel[] {
        x.forEach(y => y.CheckListCode = `${y.CheckListCode} (${y.TargetDepartment.DepartmentName}) `);
        return x;
    }

    // selectedParentChecklist(): void {
    //     this.form.controls["selectedchecklistdetails"].reset({ value: this.form.controls["checklistparentselected"].value });
    // }
    selectAllParent(): void {

        let isSelected = this.isSelected;
        if (this.checkListParentDepartmentWise.length > 0) {
            this.checkListParentDepartmentWise.forEach(x => x["IsSelected"] = (isSelected));
        }
        this.parentChecklists = [];
        //  this.parentChecklists = _.clone(this.CheckListParents.filter(x => x["IsSelected"] == true));

        if (isSelected == false && this.CheckListParents.filter(x => x["IsSelected"] == true).length <= 0) {
            this.parentChecklists = this.noDtaList;
        }
        //  if (isSelected == true && this.checkListParentDepartmentWise.filter(x => x["IsSelected"] == true).length > 0) {
        else {
            this.CheckListParents.filter(x => x["IsSelected"] == true).map(y => {
                this.parentChecklists.push(Object.assign({}, y))
            });
            this.parentChecklists = this.addDepartmentName(this.parentChecklists);

        }

        this.selectedparentChecklistdetails = this.parentChecklists[0].CheckListDetails;
        this.selectedcount = this.checkListParentDepartmentWise.filter(x => x["IsSelected"] == true).length;
    }

    parentDepartmentChange(): void {
        //  this.selectedcount = 0;
        this.checkListParentDepartmentWise = this.CheckListParents.filter(x => x.DepartmentId == this.ParentDepartmentId);
        this.selectedcount = this.checkListParentDepartmentWise.filter(x => x.IsSelected == true).length;
        this.isSelected = this.checkListParentDepartmentWise.length == this.selectedcount;
    }

    mergeResponses(departmentId): void {
        const allChecklists: Observable<ResponseModel<ChecklistModel>>
            = this.checkListService.GetAllActiveCheckListsForParent();

        const activeDepartments: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();

        const activeEmergencyTypes: Observable<ResponseModel<EmergencyTypeModel>>
            = this.emergencyTypeService.GetAll();

        Observable.merge(allChecklists, activeDepartments, activeEmergencyTypes)
            .subscribe(
            (response: ResponseModel<BaseModel>) => {
                if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'CheckListId')) {
                    this.activeCheckLists = response.Records as ChecklistModel[];
                    this.CheckListParents = response.Records as ChecklistModel[];
                    this.CheckListParents.forEach(element => {
                        element.IsSelected = false;
                    });

                    //this.checkListModel.ParentCheckListId = this.activeCheckLists[0].CheckListId;

                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'DepartmentId')) {
                    this.activeDepartments = response.Records as DepartmentModel[];
                    this.checkListModel.DepartmentId = this.activeDepartments[0].DepartmentId;
                    this.activeDepartments.forEach(x => {
                        this.parentdepartments.push(Object.assign({}, x));
                    })

                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'EmergencyTypeId')) {
                    this.activeEmergencyTypes = response.Records as EmergencyTypeModel[];
                    this.checkListModel.EmergencyTypeId = this.activeEmergencyTypes[0].EmergencyTypeId;
                }
            },
            (error) => { console.log(error); },
            () => {
                this.currentDepartmentName = this.activeDepartments.find((x) => {
                    return x.DepartmentId === this.currentDepartmentId;
                }).DepartmentName;
                this.form = this.resetCheckListForm();
                this.initiateCheckListModel();
                this.dataExchange.Subscribe('checklistModelEdited', (model) => this.onCheckListEditSuccess(model));
            }
            );
    }

    ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getAllActiveDepartments();
        this.submitted = false;
        this.selectedcount = 0;
        this.ParentDepartmentId = 0;


        this.mergeResponses(this.currentDepartmentId);
        this.getAllActiveOrganizations();
        this.credential = UtilityService.getCredentialDetails();
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('departmentChange');
        this.dataExchange.Unsubscribe('checklistModelEdited');
    }

    getAllActiveDepartments(): void {
        this.departmentService.GetAllActiveDepartments()
            .subscribe((item: ResponseModel<DepartmentModel>) => {
                this.allDepartments = item.Records;
                // this.getCheckListByDepartment(this.currentDepartmentId);
            });
    }

    // private getCheckListByDepartment(departmentId): void {
    //     this.checkListService.GetAllWithParentsByDepartment(departmentId)
    //         .subscribe((response: ResponseModel<ChecklistModel>) => {

    //             let parentIds: number[] = this.CheckListParents.map(item => item.CheckListId);
    //             this.CheckListParents = response.Records;
    //             let CheckListParentMappers: any = _.pluck(this.CheckListParents, 'CheckListParentMapper');
    //             CheckListParentMappers.forEach(element => {
    //                 if (element.length > 0) {
    //                     element.forEach((item: ChecklistMapper) => {
    //                         parentIds.push(item.ParentCheckListId);
    //                         let department: DepartmentModel = new DepartmentModel();
    //                         department.DepartmentId = item.ParentCheckList.DepartmentId;
    //                         department = this.allDepartments.find((itemDept: DepartmentModel) => {
    //                             return itemDept.DepartmentId == item.ParentCheckList.DepartmentId;
    //                         });
    //                         //   this.parentdepartments.push(department);
    //                     });
    //                 }
    //             });
    //             // this.parentdepartments = _.unique(this.parentdepartments);
    //             parentIds = _.unique(parentIds);
    //             //let parentIds: number[] = _.pluck(this.CheckListParents, 'CheckListParentMapper').map(item => item.ParentCheckListId);
    //             //let parentIds: number[] = this.CheckListParents.map(item => item.CheckListId);
    //             this.CheckListParents.forEach(element => {
    //                 element.IsSelected = false;
    //             });


    //         });
    // }

    initiateCheckListModel(): void {
        this.checkListModel = new ChecklistModel();
        this.checkListModel.ActiveFlag = 'Active';
        this.checkListModel.CreatedBy = +this.credential.UserId;
        this.checkListModel.CreatedOn = this.date;
        this.checkListModel.CheckListId = 0;
    }

    formControlDirtyCheck() {

        //  this.checkListModelEdit = new ChecklistModel();
        this.checkListModelEdit.CheckListId = this.form.controls['CheckListId'].value;

        if (this.form.controls['CheckListDetails'].touched) {
            this.checkListModelEdit.CheckListDetails = this.form.controls['CheckListDetails'].value;
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

        if (this.form.controls['OrganizationId'].touched) {
            this.checkListModelEdit.OrganizationId = this.form.controls['OrganizationId'].value;
        }

        if (this.form.controls['Stations'].touched) {
            this.checkListModelEdit.Stations = this.form.controls['Stations'].value;
        }
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                //console.log(`Error: ${error}`);
            });
    }

    onSubmit(values: object): void {
        this.submitted = true;
        let intermediate: ChecklistMapper[] = [];
        this.checkListModel.CheckListParentMapper = [];
        if (this.form.valid) {
            this.submitted = false;

            this.parentChecklists.forEach(x => {
                let item: ChecklistMapper = new ChecklistMapper();
                item.ParentCheckListId = x.CheckListId;
                delete item.ParentCheckList;
                delete item.ParentCheckList;
                intermediate.push(item);
            });
            this.checkListModel.CheckListParentMapper = _.unique(intermediate);
            if (this.checkListModel.CheckListId === 0) {// ADD REGION



                this.checkListModel.CheckListDetails = this.form.controls['CheckListDetails'].value;
                this.checkListModel.Duration = this.form.controls['Duration'].value;
                this.checkListModel.DepartmentId = +this.form.controls['DepartmentId'].value;
                this.checkListModel.URL = this.form.controls['URL'].value;
                this.checkListModel.EmergencyTypeId = +this.form.controls['EmergencyTypeId'].value;
                this.checkListModel.Sequence = this.form.controls['Sequence'].value;
                this.checkListModel.OrganizationId = +this.form.controls['OrganizationId'].value;
                this.checkListModel.Stations = this.form.controls['Stations'].value;
                delete this.checkListModel['Active'];
                delete this.checkListModel['IsSelected'];
                //delete this.checkListModel['CheckListParentMapper'];
                let CheckList_Code = '';
                const dep = this.currentDepartmentName;
                CheckList_Code = CheckList_Code + dep.trim();

                const d = new Date();
                const time = d.getTime();
                const timestring = time.toString();
                const n = timestring.substr(timestring.length - 5);

                CheckList_Code = CheckList_Code + '_' + n;

                this.checkListModel.CheckListCode = CheckList_Code;
                this.createChecklist(this.checkListModel);

            }
            else {// EDIT REGION
                delete this.checkListModel['Active'];
                delete this.checkListModel['IsSelected'];
                this.newparents = _.pluck(this.checkListModelEdit.CheckListParentMapper,'ParentCheckListId');
                let diff1= _.difference(this.newparents,this.oldparents);
                let diff2= _.difference(this.oldparents,this.newparents);
                if (this.form.dirty || diff1.length>0 || diff2.length>0) {

                    delete this.checkListModelEdit.TargetDepartment;
                    delete this.checkListModelEdit.CheckListParentMapper;
                    delete this.checkListModelEdit.CheckListChildrenMapper;
                    delete this.checkListModelEdit.Organization;
                    delete this.checkListModelEdit.StationList;
                    delete this.checkListModelEdit.EmergencyType;
                    //  this.checkListModelEdit= this.deleteattributeschecklist(this.checkListModelEdit);
                    this.formControlDirtyCheck();
                    this.checkListModelEdit.CheckListParentMapper = _.unique(intermediate);
                    this.checkListModelEdit.CheckListParentMapper.forEach(x => x.ChildCheckListId = this.checkListModelEdit.CheckListId);
                    this.checkListService.editchecklist(this.checkListModelEdit)
                        .subscribe((response1: ChecklistModel) => {
                            this.selectedcount = 0;
                            this.toastrService.success('Checklist Edited Successfully.', 'Success', this.toastrConfig);
                            this.initiateCheckListModel();
                            this.form = this.resetCheckListForm();
                            this.showAdd = false;
                            this.CheckListParents.forEach(x => x.IsSelected = false);
                            this.dataExchange.Publish('checkListListReload', response1);
                        }, (error: any) => {
                            console.log(`Error: ${error}`);
                        });
                }
            }
        }

    }

    cancel(): void {
        this.selectedcount = 0;
        this.resetCheckListForm();
        this.showAdd = false;
        this.submitted = false;
        this.CheckListParents.forEach(x => x.IsSelected = false);
        this.parentChecklists = this.noDtaList;
    }

    createChecklist(checklistMode: ChecklistModel): void {
        this.checkListService.Create(this.checkListModel)
            .subscribe((response: ChecklistModel) => {
                this.selectedcount = 0;
                this.toastrService.success('Checklist Created Successfully.', 'Success', this.toastrConfig);
                response.Organization = this.checkListModel.Organization;
                this.dataExchange.Publish('checkListListReload', response);
                this.form = this.resetCheckListForm();
                this.showAdd = false;
                this.initiateCheckListModel();
                this.CheckListParents.forEach(x => x.IsSelected = false);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onCheckListEditSuccess(data: ChecklistModel): void {
        this.showAdd = true;
        this.initiateCheckListModel();
        this.checkListModel = data;
        this.checkListModelEdit = data;
        this.form = this.resetCheckListForm(this.checkListModel);
        if (data.CheckListParentMapper.length > 0) {
            this.parentChecklists = [];
            data.CheckListParentMapper.forEach(y => {
                let obj: ChecklistModel = Object.assign({}, y.ParentCheckList);
                obj.TargetDepartment = this.activeDepartments.find(x => x.DepartmentId == obj.DepartmentId);
                this.parentChecklists.push(obj);
                this.CheckListParents.forEach(x => {
                    if (x.CheckListId == obj.CheckListId)
                        x.IsSelected = true;
                });

            });
            this.parentChecklists = this.addDepartmentName(this.parentChecklists);
            this.oldparents=_.pluck(data.CheckListParentMapper,'ParentCheckListId');
        }
        else {
            this.parentChecklists = this.noDtaList;
        }
    }

    showAddRegion(): void {
        this.form = this.resetCheckListForm();
        this.showAdd = true;
        this.CheckListParents.forEach(element => {
            element.IsSelected = false;
        });
        this.parentChecklists = this.noDtaList;
    }



    private resetCheckListForm(checkList?: ChecklistModel): FormGroup {

        return new FormGroup({
            CheckListId: new FormControl(checkList ? checkList.CheckListId : 0),
            CheckListDetails: new FormControl(checkList ? checkList.CheckListDetails : '', [Validators.required]),
            ParentDepartmentId: new FormControl(''),
            Duration: new FormControl(checkList ? checkList.Duration : '', [Validators.required]),
            DepartmentId: new FormControl(checkList ? checkList.DepartmentId : '', [Validators.required]),
            URL: new FormControl(checkList ? checkList.URL : '', [Validators.required, URLValidator.validate]),
            EmergencyTypeId: new FormControl(checkList ? checkList.EmergencyTypeId : '', [Validators.required]),
            Sequence: new FormControl(checkList ? checkList.Sequence : '', [Validators.required]),
            OrganizationId: new FormControl(checkList ? checkList.OrganizationId : '', [Validators.required]),
            Stations: new FormControl(checkList ? checkList.Stations : ''),
            isSelected: new FormControl(false),
            selectedchecklistdetails: new FormControl(''),
            checklistparentselected: new FormControl('')
        });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.mergeResponses(this.currentDepartmentId);
    }



    private deleteattributeschecklist(checklist: ChecklistModel): ChecklistModel {
        delete checklist.ActiveFlag;
        delete checklist.CreatedBy;
        delete checklist.CreatedOn;
        return checklist;

    }
}


