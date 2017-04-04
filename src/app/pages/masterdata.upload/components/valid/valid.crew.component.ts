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
import { InvolvePartyModel, AffectedPeopleModel, CrewModel } from '../../../shared.components/'

@Component({
    selector: 'validCrew-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.crew.list.view.html'
})

export class ValidCrewListComponent implements OnInit, OnDestroy{
        
    crews: CrewModel[] = []
    @Input() IncidentId: string;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
                private dataExchange: DataExchangeService<CrewModel>){}   

    ngOnInit(): void{
      this.dataExchange.Subscribe("OpenCrews", model => this.OpenCrews(model))
    }

    OpenCrews(Crew: CrewModel): void{
        this.crews = [];
        this.getValidCrewRecords();
    }

    getValidCrewRecords(): void{
        this._validRecordService.GetAllCrewByIncidentId(+this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.crews.push(a.Crew);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenCrews");
    }
}