import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import { ResponseModel, DataExchangeService, UtilityService } from '../../../shared';
import { GlobalConstants } from '../../../shared/constants';


@Component({
    selector: 'actionable-close',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.close.html',
    styleUrls: ['../styles/actionable.style.scss']
})
export class ActionableClosedComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: any;
    @Input() IncidentId: any;
    public form: FormGroup;
    private departmentId: number = null;
    private incidentId: number = null;
    closeActionables: ActionableModel[] = [];
    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private dataExchange: DataExchangeService<boolean>) {

    }
    ngOnInit(): any {
        this.departmentId = Number(this.DepartmentId);
        this.incidentId = Number(this.IncidentId);
        this.getAllCloseActionable(this.incidentId, this.departmentId);
        this.form = this.resetActionableForm();
        this.dataExchange.Subscribe("CloseActionablePageInitiate", model => this.onCloseActionablePageInitiate(model));
    }
    private resetActionableForm(actionable?: ActionableModel): FormGroup {
        return new FormGroup({
            Comments: new FormControl(''),
            URL: new FormControl('')
        });
    }
    onCloseActionablePageInitiate(isClosed: boolean): void {
        this.departmentId = Number(this.DepartmentId);
        this.incidentId = Number(this.IncidentId);
        this.getAllCloseActionable(this.incidentId, this.departmentId);
        
    }
    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("CloseActionablePageInitiate");
    }
    IsReopen(event: any, editedActionable: ActionableModel): void {
        console.log(event.checked);
        if (!event.checked) {
            editedActionable.Done = false;
        }
        else {
            editedActionable.Done = true;
        }
        let tempActionable = this.closeActionables.filter(function (item: ActionableModel) {
            return (item.ActionId == editedActionable.ActionId);
        });
        tempActionable[0].Reopen = editedActionable.Reopen;
    }
    getAllCloseActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllCloseByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                for (var x of response.Records) {
                    if (x.ActiveFlag == 'Active') {
                        x.Active = true;
                    }
                    else {
                        x.Active = false;
                    }
                }
                this.closeActionables = response.Records;
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
    closedActionableClick(closedActionablesUpdate: ActionableModel[]): void {
        console.log(closedActionablesUpdate);
        let filterActionableUpdate = closedActionablesUpdate.filter(function (item: ActionableModel) {
            return (item.Done == true);
        });
        this.batchUpdate(filterActionableUpdate.map(x => {
            return {
                ActionId: x.ActionId,
                ActualClose: new Date(),
                CompletionStatus: "Open",
                ReopenedBy: 1,
                ReopenedOn: new Date()
            };
        }));
        console.log(filterActionableUpdate);
    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                console.log(x.StatusCodes);
                this.getAllCloseActionable(this.incidentId, this.departmentId);
            });
    }

    cancelUpdateCommentAndURL(editedActionableModel: ActionableModel): void {
        console.log(editedActionableModel);
        editedActionableModel.show = false;
    }
}