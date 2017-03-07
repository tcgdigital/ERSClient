import {
    Component, ViewEncapsulation,
    Input, OnInit, OnDestroy
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
    UtilityService, GlobalConstants
} from '../../../../shared';


@Component({
    selector: 'actionable-close',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.close.html',
    styleUrls: ['../styles/actionable.style.scss']
})
export class ActionableClosedComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: any;
    @Input() IncidentId: any;

    closeActionables: ActionableModel[] = [];

    public form: FormGroup;

    private departmentId: number = null;
    private incidentId: number = null;


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
        let tempActionable = this.closeActionables
            .find((item: ActionableModel) => item.ActionId == editedActionable.ActionId);
        tempActionable[0].Reopen = editedActionable.Reopen;
    }

    getAllCloseActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllCloseByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.closeActionables = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    actionableDetail(editedActionableModel: ActionableModel): void {
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        editedActionableModel.show = true;
    }

    closedActionableClick(closedActionablesUpdate: ActionableModel[]): void {
        let filterActionableUpdate = closedActionablesUpdate.filter((item: ActionableModel) => {
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
    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                this.getAllCloseActionable(this.incidentId, this.departmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelUpdateCommentAndURL(editedActionableModel: ActionableModel): void {
        editedActionableModel.show = false;
    }
}