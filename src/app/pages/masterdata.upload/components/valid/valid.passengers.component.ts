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

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { InvolvePartyModel, AffectedPeopleModel, PassengerModel } from '../../../shared.components/'

@Component({
    selector: 'validPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.passenger.list.view.html'
})

export class ValidPassengersListComponent implements OnInit, OnDestroy{
        
    passengers: PassengerModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
                private dataExchange: DataExchangeService<PassengerModel>){}

    ngOnInit(): void{       
        this.dataExchange.Subscribe("OpenPassengers", model=>this.OpenPassengers(model))
    }

    OpenPassengers(passenger: PassengerModel): void{
        this.passengers=[];
        this.getValidPassengerRecords();
    }

    getValidPassengerRecords(): void{
        this._validRecordService.GetAllPassengerByIncidentId(+this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.passengers.push(a.Passenger);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenPassengers");
    }
}



