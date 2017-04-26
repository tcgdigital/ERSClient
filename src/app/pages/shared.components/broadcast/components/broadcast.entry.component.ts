import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { BroadCastModel } from './broadcast.model';
import { DepartmentBroadcastModel } from './departmentBroadcast.mode';
import {
    BroadCastDepartmentModel,
    BroadcastDepartmentService
} from '../../../masterdata/broadcast.department';
import { BroadcastService } from './broadcast.service';
import { DepartmentModel, DepartmentService } from '../../../masterdata/department';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, UtilityService, GlobalStateService
} from '../../../../shared';

@Component({
    selector: 'broadcast-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.entry.view.html'
})
export class BroadcastEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    public form: FormGroup;
    deptBrodCastModels: DepartmentBroadcastModel[] = null;
    deptBroadcast: DepartmentBroadcastModel;
    broadcast: BroadCastModel = new BroadCastModel();
    BroadCastDepartmentMappings: BroadCastDepartmentModel[] = [];
    currentDepartment: BroadCastDepartmentModel = new BroadCastDepartmentModel();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    currentIncidentId: number;
    currentDepartmentId: number;
    buttonValue: String = "";
    showAdd: boolean;
    listSelected: boolean;
    selectedcount: number;

    /**
     * Creates an instance of BroadcastEntryComponent.
     * @param {BroadcastDepartmentService} broadcastDepartmentMappingService 
     * @param {BroadcastService} broadcastService 
     * @param {DataExchangeService<BroadCastModel>} dataExchange 
     * @param {FormBuilder} builder 
     * 
     * @memberOf BroadcastEntryComponent
     */
    constructor(private broadcastDepartmentMappingService: BroadcastDepartmentService,
        private broadcastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>, private departmentService: DepartmentService,
        private builder: FormBuilder, private globalState: GlobalStateService) {
        this.deptBrodCastModels = [];
        this.buttonValue = "Add New Broadcast Message";
        this.showAdd = false;
        this.listSelected = false;
        this.selectedcount = 0;
    }

    ngOnInit(): void {

        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.getBroadcastDepartmentMappings(this.currentDepartmentId);

        this.broadcast.IsSubmitted = false;
        this.broadcast.Priority = this.priorities.find(x => x.value == '1').caption;
        this.broadcast.DepartmentBroadcasts = [];
        this.Action = 'Save';
        this.initiateForm();

        this.dataExchange.Subscribe('OnBroadcastUpdate', model => this.onBroadcastUpdate(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getBroadcastDepartmentMappings(this.currentDepartmentId);
    }

    private getBroadcastDepartmentMappings(departmentId): void {
        this.broadcastDepartmentMappingService.Query(departmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                let broadcastmappingIds: number[] = this.BroadCastDepartmentMappings.map(item => item.BroadcastDepartmentMappingId);
                this.BroadCastDepartmentMappings = response.Records;
                this.BroadCastDepartmentMappings.forEach(element => {
                    element.IsSelected = false;
                });
                this.currentDepartment.TargetDepartmentId = departmentId;
                this.currentDepartment.BroadcastDepartmentMappingId = Math.max.apply(Math, broadcastmappingIds) + 1;
                this.currentDepartment.TargetDepartment = new DepartmentModel();
                this.currentDepartment.TargetDepartment.DepartmentId = departmentId;
                this.departmentService.Get(departmentId)
                    .subscribe((response1: DepartmentModel) => {
                        this.currentDepartment.TargetDepartment.DepartmentName = response1.DepartmentName;
                    });

                this.BroadCastDepartmentMappings.push(this.currentDepartment);
            });
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('OnBroadcastUpdate');
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    initiateForm(): void {
        this.form = new FormGroup({
            BroadcastId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
            SelectAllDepartment: new FormControl(0),
            BroadCastDepartmentMappings: new FormControl(0),
            Priority: new FormControl(this.priorities.find(x => x.value == '1').caption)
        });
    };

    selectAllDepartment(IsAllSelected: boolean): void {
        this.broadcast.DepartmentBroadcasts = [];
        this.BroadCastDepartmentMappings.forEach(element => {
            element.IsSelected = IsAllSelected;
            if (IsAllSelected) {
                this.deptBroadcast = new DepartmentBroadcastModel();
                this.deptBroadcast.DepartmentId = element.TargetDepartmentId;
                this.broadcast.DepartmentBroadcasts.push(this.deptBroadcast);
            }
            else {
                this.broadcast.DepartmentBroadcasts = [];
                this.selectedcount = 0;
            }
        });
        this.selectedcount = this.broadcast.DepartmentBroadcasts.length;
    }

    selectDepartment(event, department: BroadCastDepartmentModel): void {
        this.BroadCastDepartmentMappings.forEach(item => {
            if (item.TargetDepartmentId === department.TargetDepartmentId) {
                item.IsSelected = event.target.checked;
            }
        });
        this.selectedcount = this.BroadCastDepartmentMappings.filter(x => { return x.IsSelected == true; }).length;
    }

    save(isSubmitted: boolean): void {
        this.broadcast.IsSubmitted = isSubmitted;
        if (isSubmitted) {
            this.broadcast.SubmittedOn = new Date();
        }
        this.broadcast.DepartmentBroadcasts = []

        this.BroadCastDepartmentMappings.forEach(item => {
            if (item.IsSelected) {
                this.deptBroadcast = new DepartmentBroadcastModel();
                if (this.broadcast.BroadcastId !== 0) {
                    this.deptBroadcast.BroadcastId = this.broadcast.BroadcastId;
                }
                this.deptBroadcast.DepartmentId = item.TargetDepartmentId;
                this.broadcast.DepartmentBroadcasts.push(this.deptBroadcast);
            }
        });

        if (this.form.valid) {
            this.CreateOrUpdateBroadcast();
        }
    }

    CreateOrUpdateBroadcast(): void {
        UtilityService.setModelFromFormGroup<BroadCastModel>(this.broadcast, this.form,
            x => x.BroadcastId, x => x.Message, x => x.Priority);
        this.broadcast.IncidentId = this.currentIncidentId;
        this.broadcast.InitiateDepartmentId = this.currentDepartmentId;
        if (this.broadcast.BroadcastId == 0) {
            this.broadcastService.Create(this.broadcast)
                .subscribe((response: BroadCastModel) => {
                    this.dataExchange.Publish('BroadcastModelSaved', response);
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.broadcastService.Create(this.broadcast)
                .subscribe((response: BroadCastModel) => {
                    this.dataExchange.Publish('BroadcastModelUpdated', response);
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    onBroadcastUpdate(broadcastModel: BroadCastModel): void {
        this.broadcast = broadcastModel;
        this.broadcast.IncidentId = this.currentIncidentId;
        this.broadcast.IsUpdated = true;
        this.showAdd = true;

        this.BroadCastDepartmentMappings.forEach(item => {
            item.IsSelected = this.broadcast.DepartmentBroadcasts
                .some(x => x.DepartmentId === item.TargetDepartmentId);
        });
        this.selectedcount = this.BroadCastDepartmentMappings.filter(x => { return x.IsSelected == true; }).length;
    }

    cancel(): void {
        this.broadcast = new BroadCastModel();
        this.showAdd = false;
        this.initiateForm();
        this.broadcast.Priority = this.priorities.find(x => x.value == '1').caption;
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.listSelected = false;
    };

    showList = function (e) {
        if (this.listSelected)
            this.listSelected = false;
        else
            this.listSelected = true;
    };

    showList1 = function (e) {
        this.listSelected = false;
    };
}