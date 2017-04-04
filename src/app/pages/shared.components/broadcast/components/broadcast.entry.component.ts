import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators
} from '@angular/forms';
import { BroadCastModel } from './broadcast.model';
import { DepartmentBroadcastModel } from './departmentBroadcast.mode';
import {
    BroadCastDepartmentModel,
    BroadcastDepartmentService
} from '../../../masterdata/broadcast.department';
import { BroadcastService } from './broadcast.service';
import { DepartmentModel } from '../../../masterdata/department';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, UtilityService
} from '../../../../shared';

@Component({
    selector: 'broadcast-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.entry.view.html'
})
export class BroadcastEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    public form: FormGroup;
    deptBrodCastModels: DepartmentBroadcastModel[] = null;
    deptBroadcast: DepartmentBroadcastModel;
    broadcast: BroadCastModel = new BroadCastModel();
    BroadCastDepartmentMappings: BroadCastDepartmentModel[] = [];
    currentDepartment: BroadCastDepartmentModel = new BroadCastDepartmentModel();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;

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
        private dataExchange: DataExchangeService<BroadCastModel>,
        private builder: FormBuilder) {
        this.deptBrodCastModels = [];
    }

    ngOnInit(): void {
        this.broadcastDepartmentMappingService.Query(+this.initiatedDepartmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                let broadcastmappingIds: number[] = this.BroadCastDepartmentMappings.map(item => item.BroadcastDepartmentMappingId);

                this.BroadCastDepartmentMappings = response.Records;
                this.currentDepartment.TargetDepartmentId = +this.initiatedDepartmentId;
                this.currentDepartment.BroadcastDepartmentMappingId = Math.max.apply(Math, broadcastmappingIds) + 1;
                this.currentDepartment.TargetDepartment = new DepartmentModel();
                this.currentDepartment.TargetDepartment.DepartmentId = +this.initiatedDepartmentId;
                this.currentDepartment.TargetDepartment.DepartmentName = 'Command Centre';
                this.BroadCastDepartmentMappings.push(this.currentDepartment);
            });


        this.broadcast.IncidentId = +this.currentIncidentId;
        this.broadcast.InitiateDepartmentId = +this.initiatedDepartmentId;
        this.broadcast.IsSubmitted = false;
        this.broadcast.Priority = this.priorities.find(x=> x.value == '1').caption;
        this.BroadCastDepartmentMappings.forEach(element => {
            element.IsSelected = false;
        });
        this.broadcast.DepartmentBroadcasts = [];
        this.Action = 'Save';
        this.initiateForm();
        
        this.dataExchange.Subscribe('OnBroadcastUpdate', model => this.onBroadcastUpdate(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('OnBroadcastUpdate')
    }

    initiateForm():void{
        this.form = new FormGroup({
            BroadcastId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
            SelectAllDepartment: new FormControl(0),
            BroadCastDepartmentMappings: new FormControl(0),
            Priority: new FormControl(this.priorities.find(x=> x.value == '1').caption)
        });
    }

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
            }
        });
    }

    selectDepartment(event, department: BroadCastDepartmentModel) {
        this.BroadCastDepartmentMappings.forEach(item => {
            if (item.TargetDepartmentId === department.TargetDepartmentId) {
                item.IsSelected = event.target.checked;
            }
        });
    }

    save(isSubmitted: boolean): void {
        this.broadcast.IsSubmitted = isSubmitted;
        if (isSubmitted) {
            this.broadcast.SubmittedOn = new Date();
        }
        this.broadcast.DepartmentBroadcasts = []
        // this.BroadCastDepartmentMappings.filter(x => x.IsSelected)
        //     .map(x => {
        //         let deptBroadcast = new DepartmentBroadcastModel();
        //         if (this.broadcast.BroadcastId !== 0) {
        //             deptBroadcast.BroadcastId = this.broadcast.BroadcastId;
        //         }
        //         deptBroadcast.DepartmentId = x.TargetDepartmentId;
        //         return deptBroadcast;
        //     });

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
        this.broadcast.IncidentId = +this.currentIncidentId;
        this.broadcast.InitiateDepartmentId = +this.initiatedDepartmentId;
        
        if (this.broadcast.BroadcastId == 0) {
            this.broadcastService.Create(this.broadcast)
                .subscribe((response: BroadCastModel) => {
                    this.dataExchange.Publish('BroadcastModelSaved', response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.broadcastService.Create(this.broadcast)
                .subscribe((response: BroadCastModel) => {
                    this.dataExchange.Publish('BroadcastModelUpdated', response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    onBroadcastUpdate(broadcastModel: BroadCastModel): void {
        this.broadcast = broadcastModel;
        this.broadcast.IncidentId = +this.currentIncidentId;
        this.broadcast.IsUpdated = true;

        this.BroadCastDepartmentMappings.forEach(item => {
            item.IsSelected = this.broadcast.DepartmentBroadcasts
                .some(x => x.DepartmentId === item.TargetDepartmentId);
        });
    }

    cancel(): void {
        this.broadcast = new BroadCastModel();
        this.initiateForm();
        this.broadcast.Priority = this.priorities.find(x=> x.value == '1').caption;
     }
}