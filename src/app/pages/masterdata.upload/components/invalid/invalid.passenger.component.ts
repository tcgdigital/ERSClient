import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants
} from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service'
import { InvalidPassengerModel } from '../../../shared.components/'

@Component({
    selector: 'invalidPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.passenger.view.html'
})

export class InvalidPassengersListComponent implements OnInit{
        
    invalidPassengers: InvalidPassengerModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService){}

    ngOnInit(): void{
        this.getInvalidPassengerRecords();
    }

    getInvalidPassengerRecords(): void{
        this._invalidRecordService.GetAllInvalidPassengersByIncident(+this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.invalidPassengers.push(a);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }
}



