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
import { InvolvePartyModel, CargoModel } from '../../../shared.components/'

@Component({
    selector: 'validCargo-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.cargo.list.view.html'
})

export class ValidCargoListComponent implements OnInit, OnDestroy{
        
    cargoes: CargoModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
                private dataExchange: DataExchangeService<CargoModel>){}

    ngOnInit(): void{
        this.dataExchange.Subscribe("OpenCargoes", model => this.OpenCargoes(model));        
    }

    OpenCargoes(cargo: CargoModel): void{
        this.cargoes=[];
        this.getValidCargoRecords();
    }

    getValidCargoRecords(): void{
        this._validRecordService.GetAllCargoByIncidentId(+this.IncidentId)       
        .flatMap(x=>x)
        .subscribe(a=>{
            this.cargoes.push(a);                  
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenCargoes");
    }
}



