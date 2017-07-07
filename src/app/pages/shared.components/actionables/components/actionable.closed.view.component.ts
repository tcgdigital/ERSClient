import {
    Component, ViewEncapsulation,
    Input, OnInit, OnDestroy, ViewChild, Injector
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department/components';
import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import {
    ResponseModel, DataExchangeService, KeyValue,
    UtilityService, GlobalConstants, GlobalStateService, AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'actionable-close',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.close.html'
})
export class ActionableClosedComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;

    closeActionables: ActionableModel[] = [];
    public form: FormGroup;
    actionableModelToUpdate: ActionableModel;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    parentChecklistIds: number[] = [];
    actionableWithParents: ActionableModel[] = [];
    public globalStateProxy: GlobalStateService;
    public completionStatusTypes: any[] = GlobalConstants.CompletionStatusType;
    private currentDepartmentId: number = null;
    private currentIncident: number = null;

    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private dataExchange: DataExchangeService<boolean>, private globalState: GlobalStateService,
        private toastrService: ToastrService, private departmentService: DepartmentService,
        private toastrConfig: ToastrConfig, private _router: Router,
        private injector: Injector) {
        this.globalStateProxy = injector.get(GlobalStateService);
    }

    ngOnInit(): any {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');

        }
        else {
            this.isArchive = false;
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
        this.credential = UtilityService.getCredentialDetails();


        this.form = this.resetActionableForm();
        this.actionableModelToUpdate = new ActionableModel();
        this.dataExchange.Subscribe('CloseActionablePageInitiate', (model) =>       this.onCloseActionablePageInitiate(model));

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    onCloseActionablePageInitiate(isClosed: boolean): void {
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('CloseActionablePageInitiate');
        this.dataExchange.Unsubscribe('departmentChangeFromDashboard');

    }

    IsReopen(event: any, editedActionable: ActionableModel): void {
        const tempActionable = this.closeActionables
            .find((item: ActionableModel) => item.ActionId === editedActionable.ActionId);
        tempActionable.Done = true;
        this.actionableService.SetParentActionableStatusByIncidentIdandDepartmentIdandActionable(this.currentIncident,
            this.currentDepartmentId, editedActionable, this.closeActionables);

    }

    getAllCloseActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllCloseByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.closeActionables = response.Records;
                this.closeActionables.forEach((x) => {
                    x['expanded'] = false;
                    x['Done'] = false;
                    x['actionableChilds'] = [];
                });
                this.getAllCloseActionableByIncident(this.currentIncident);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllCloseActionableByIncident(incidentId): void {
        this.actionableService.GetAllCloseByIncidentId(incidentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.actionableWithParents = response.Records;
                this.parentChecklistIds = this.actionableWithParents.map((actionable) => {
                    return 1;
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    openActionableDetail(editedActionableModel: ActionableModel): void {
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        this.actionableModelToUpdate = editedActionableModel;
        this.childModal.show();
    }

    openChildActionable(actionable: ActionableModel): void {
        actionable['expanded'] = !actionable['expanded'];
        this.actionableService.GetChildActionables(actionable.ChklistId, this.currentIncident)
            .subscribe((responseActionable: ResponseModel<ActionableModel>) => {
                this.departmentService.GetDepartmentNameIds()
                    .subscribe((response: ResponseModel<DepartmentModel>) => {
                        let childActionables: ActionableModel[] = [];
                        childActionables = responseActionable.Records;
                        childActionables.forEach((x) => {
                            x['DepartmentName'] = response.Records
                                .find((y) => y.DepartmentId === x.DepartmentId).DepartmentName;
                        });
                        actionable['actionableChilds'] = childActionables;

                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    closedActionableClick(closedActionablesUpdate: ActionableModel[]): void {
        const filterActionableUpdate = closedActionablesUpdate.filter((item: ActionableModel) => {
            return (item.Done === true);
        });
        if (filterActionableUpdate.length > 0) {
            filterActionableUpdate.forEach((x) => {
                delete x['expanded'];
                delete x['actionableChilds'];

            });
            this.batchUpdate(filterActionableUpdate.map((x) => {
                return {
                    ActionId: x.ActionId,
                    ActualClose: (x.CompletionStatus === 'Closed') ? new Date() : null,
                    CompletionStatus: x.CompletionStatus,
                    CompletionStatusChangedBy: this.credential.UserId,
                    CompletionStatusChangedOn: new Date()
                };
            }));
        }
        else {
            this.toastrService.error('Please select at least one checklist', 'Error', this.toastrConfig);
        }
    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe((x) => {
                this.toastrService.success('Actionables updated successfully.', 'Success', this.toastrConfig);
                this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
                this.globalStateProxy.NotifyDataChanged('checkListStatusChange', null);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelUpdateCommentAndURL(): void {
        this.childModal.hide();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident.Value;
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    private hasChildChecklist(checkListId): boolean {
        if (this.parentChecklistIds.length !== 0)
            return this.parentChecklistIds.some((x) => x === checkListId);
        else
            return false;
    }

    private resetActionableForm(actionable?: ActionableModel): FormGroup {
        return new FormGroup({
            Comments: new FormControl(''),
            URL: new FormControl('')
        });
    }
}