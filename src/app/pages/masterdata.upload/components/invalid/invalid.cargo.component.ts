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
import { InvalidCargoModel } from '../../../shared.components/'

@Component({
    selector: 'invalidCargo-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.cargo.view.html'
})

export class InvalidCargoListComponent implements OnInit{
        
    invalidCargoes: InvalidCargoModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
                private dataExchange: DataExchangeService<InvalidCargoModel>){}

    ngOnInit(): void{       
        this.dataExchange.Subscribe("OpenInvalidCargoes", model => this.OpenInvalidCargoes(model))
    }

    OpenInvalidCargoes(invalidCargo: InvalidCargoModel){
        this.invalidCargoes = [];
        this.getInvalidCargoRecords();
    }

    getInvalidCargoRecords(): void{
        this._invalidRecordService.GetAllInvalidCargosByIncident(+this.IncidentId)       
        .flatMap(x=>x)
        .subscribe(a=>{
            this.invalidCargoes.push(a);                  
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }
}



