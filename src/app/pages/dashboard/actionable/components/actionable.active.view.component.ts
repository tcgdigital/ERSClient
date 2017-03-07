import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService
} from '../../../../shared';

@Component({
    selector: 'actionable-active',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.active.html',
    styleUrls: ['../styles/actionable.style.scss']
})
export class ActionableActiveComponent implements OnInit, OnDestroy, AfterContentInit {
    @Input() DepartmentId: any;
    @Input() IncidentId: any;
    public form: FormGroup;
    @ViewChild('myFileInput') myInputVariable: any;
    private departmentId: number = null;
    private incidentId: number = null;
    editActionableModel: ActionableModel = null;
    tempActionable: ActionableModel = null;
    activeActionables: ActionableModel[] = [];
    filesToUpload: Array<File>;
    filepathWithLinks: string = null;
    fileName: string = null;

    /**
     * Creates an instance of ActionableActiveComponent.
     * @param {FormBuilder} formBuilder 
     * @param {ActionableService} actionableService 
     * @param {DataExchangeService<boolean>} dataExchange 
     * 
     * @memberOf ActionableActiveComponent
     */
    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>) {
        this.filesToUpload = [];
    }

    /**
     * 
     * 
     * @returns {*} 
     * 
     * @memberOf ActionableActiveComponent
     */
    ngOnInit(): any {
        this.departmentId = Number(this.DepartmentId);
        this.incidentId = Number(this.IncidentId);
        this.getAllActiveActionable(this.incidentId, this.departmentId);
        this.form = this.resetActionableForm();
        this.dataExchange.Subscribe("OpenActionablePageInitiate", model => this.onOpenActionablePageInitiate(model));
    }

    /**
     * 
     * 
     * @private
     * @param {ActionableModel} [actionable] 
     * @returns {FormGroup} 
     * 
     * @memberOf ActionableActiveComponent
     */
    private resetActionableForm(actionable?: ActionableModel): FormGroup {
        return new FormGroup({
            Comments: new FormControl(''),
            URL: new FormControl('')
        });
    }

    /**
     * 
     * 
     * @param {boolean} isOpen 
     * 
     * @memberOf ActionableActiveComponent
     */
    onOpenActionablePageInitiate(isOpen: boolean): void {
        this.departmentId = Number(this.DepartmentId);
        this.incidentId = Number(this.IncidentId);
        this.getAllActiveActionable(this.incidentId, this.departmentId);
    }
    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OpenActionablePageInitiate");
    }

    ngAfterContentInit(): void {
        this.setRagIntervalHandler();
    }

    IsDone(event: any, editedActionable: ActionableModel): void {
        console.log(event.checked);
        if (!event.checked) {
            editedActionable.Done = false;
        }
        else {
            editedActionable.Done = true;
        }
        let tempActionable = this.activeActionables.filter(function (item: ActionableModel) {
            return (item.ActionId == editedActionable.ActionId);
        });
        tempActionable[0].Done = editedActionable.Done;
    }

    upload(actionableClicked: ActionableModel) {
        console.log(this.filesToUpload.length);

        if (this.filesToUpload.length > 0) {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            this.fileUploadService.uploadFiles<string>(baseUrl + "api/fileUpload/upload", this.filesToUpload)
                .subscribe((result: string) => {
                    console.log(result);
                    this.filepathWithLinks = `${GlobalConstants.EXTERNAL_URL}UploadFiles/${result.replace(/^.*[\\\/]/, '')}`;
                    let extension = result.replace(/^.*[\\\/]/, '').split('.').pop();
                    this.fileName = `Checklist_${actionableClicked.CheckListCode}_${actionableClicked.IncidentId}.${extension}`;

                }, (error) => {
                    console.error(error);
                });
        }

    }
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }


    clearFileUpload(event: any): void {

        console.log(this.myInputVariable.nativeElement.files);
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
        console.log(this.myInputVariable.nativeElement.files);

    }
    getAllActiveActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllOpenByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.activeActionables = response.Records;
            });
    }

    private setRagIntervalHandler(): void {
        Observable.interval(10000).subscribe(_ => {
            this.activeActionables.forEach((item: ActionableModel) => {
                item.RagColor = this.actionableService.setRagColor(item.AssignedDt, item.ScheduleClose);
                console.log(`Schedule run RAG ststus: ${item.RagColor}`);
            });
        });
    }
    actionableDetail(editedActionableModel: ActionableModel): void {
        console.log(editedActionableModel);
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        editedActionableModel.show = true;
    }
    cancelUpdateCommentAndURL(editedActionableModel: ActionableModel): void {
        console.log(editedActionableModel);
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
        editedActionableModel.show = false;
    }
    updateCommentAndURL(values: Object, editedActionableModel: ActionableModel): void {
        console.log(editedActionableModel);

        this.editActionableModel = new ActionableModel();
        this.editActionableModel.ActionId = editedActionableModel.ActionId;
        this.editActionableModel.Comments = this.form.controls['Comments'].value;
        if (this.filepathWithLinks != "") {
            this.editActionableModel.UploadLinks = this.filepathWithLinks;
            console.log(this.editActionableModel.UploadLinks);
        }

        console.log(this.editActionableModel);
        this.actionableService.Update(this.editActionableModel)
            .subscribe((response: ActionableModel) => {
                editedActionableModel.show = false;
                this.tempActionable = this.activeActionables.filter(function (item: ActionableModel) {
                    return (item.ActionId == editedActionableModel.ActionId);
                })[0];
                this.tempActionable.Comments = this.editActionableModel.Comments;
                this.tempActionable.UploadLinks = this.filepathWithLinks;
                this.tempActionable.FileName = this.fileName;
            }, (error: any) => {
                console.log("Error");
            });
    }
    activeActionableClick(activeActionablesUpdate: ActionableModel[]): void {
        console.log(activeActionablesUpdate);
        
        let filterActionableUpdate = activeActionablesUpdate.filter((item: ActionableModel) => {
            return (item.Done == true);
        });
        this.batchUpdate(filterActionableUpdate.map(x => {
            return {
                ActionId: x.ActionId,
                ActualClose: new Date(),
                ClosedBy: 1,
                CompletionStatus: "Close",
                ClosedOn: new Date()
            };
        }));
        console.log(filterActionableUpdate);

    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                console.log(x.StatusCodes);
                this.getAllActiveActionable(this.incidentId, this.departmentId);
            });
    }

}