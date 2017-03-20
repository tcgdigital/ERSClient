import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { ChecklistModel } from './checklist.model';
import { ChecklistService } from './checklist.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';
import { DepartmentModel, DepartmentService } from '../../department';
import { EmergencyTypeModel } from '../../emergencytype';

@Component({
    selector: 'checklist-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/checklist.list.view.html',
    styleUrls: ['../styles/checklist.style.scss']
})
export class ChecklistListComponent implements OnInit {
    checkLists: ChecklistModel[] = [];
    activeCheckLists: ChecklistModel[] = [];
    activeDepartments: DepartmentModel[] = [];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    checkListModelPatch: ChecklistModel = null;
    date: Date = new Date();
    
    constructor(private checkListService: ChecklistService,
        private dataExchange: DataExchangeService<ChecklistModel>) { }

    initiateCheckListModelPatch(): void {
        this.checkListModelPatch = new ChecklistModel();
        this.checkListModelPatch.ActiveFlag = 'Active';
        this.checkListModelPatch.CreatedBy = 1;
        this.checkListModelPatch.CreatedOn = this.date;
    }

    getCheckLists(): void {
        this.checkListService.GetAll()
            .subscribe((response: ResponseModel<ChecklistModel>) => {
                for (var x of response.Records) {
                    if (x.ActiveFlag == 'Active') {
                        x.Active = true;
                    }
                    else {
                        x.Active = false;
                    }
                }
                this.checkLists = response.Records;
            });
    }

    getAllActiveCheckLists(): void {
        this.checkListService.GetAllActiveCheckLists()
            .subscribe((response: ResponseModel<ChecklistModel>) => {
                this.activeCheckLists = response.Records;
            });
    }

    onCheckListModelSavedSuccess(data: ChecklistModel): void {
        this.checkLists.unshift(data);
    }

    ngOnInit(): void {
        this.getAllActiveCheckLists();
        this.getCheckLists();
        this.dataExchange.Subscribe("checkListModelSaved", 
            model => this.onCheckListModelSavedSuccess(model));
        this.dataExchange.Subscribe("checkListListReload", 
            model => this.onCheckListModelReloadSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("checkListModelSaved");
        this.dataExchange.Unsubscribe("checkListListReload");
    }

    editChecklist(editedChecklistModel: ChecklistModel): void {
        this.dataExchange.Publish("checklistModelEdited", editedChecklistModel);
    }

    onCheckListModelReloadSuccess(editedChecklistModel: ChecklistModel): void {
        this.getCheckLists();
    }

    IsActive(event: any, editedCheckList: ChecklistModel): void {
        this.initiateCheckListModelPatch();
        this.checkListModelPatch.CheckListId = editedCheckList.CheckListId;
        this.checkListModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.checkListModelPatch.ActiveFlag = 'InActive';
        }
        this.checkListService.Update(this.checkListModelPatch)
            .subscribe((response: ChecklistModel) => {
                this.getCheckLists();
            }, (error: any) => {
                console.log("Error");
            });
    }
}