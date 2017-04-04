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
import { InvalidCrewModel } from '../../../shared.components/'

@Component({
    selector: 'invalidCrew-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.crew.view.html'
})

export class InvalidCrewListComponent implements OnInit{
        
    invalidCrews: InvalidCrewModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService
                ,private dataExchange: DataExchangeService<InvalidCrewModel>){       
    }

    ngOnInit(): void{        
        this.dataExchange.Subscribe("OpenInvalidCrews", model => this.openInvalidCrews(model))
    }

    openInvalidCrews(invalidCrew: InvalidCrewModel): void{
        this.invalidCrews = [];
        this.getInvalidCrewRecords();
    }

    getInvalidCrewRecords(): void{
        this._invalidRecordService.GetAllInvalidCrewsByIncident(+this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.invalidCrews.push(a);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }
}