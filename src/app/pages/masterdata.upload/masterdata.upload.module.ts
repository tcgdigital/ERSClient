import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MasterDataUploadRouting } from './masterdata.upload.routing';
import { MasterDataUploadComponent } from './masterdata.upload.component';

import { 
            MasterDataUploadForValidService, 
            MasterDataUploadForInvalidService,
            MasterDataUploadListComponent 
        }   from './components'
import { ValidPassengersListComponent, ValidCargoListComponent, ValidCrewListComponent } from './components/valid'
import { InvalidCrewListComponent, InvalidPassengersListComponent, InvalidCargoListComponent } from './components/invalid'
import { DataExchangeService, FileUploadService } from '../../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MasterDataUploadRouting
    ],
    declarations: [        
        MasterDataUploadComponent,
        MasterDataUploadListComponent,
        ValidPassengersListComponent,
        ValidCargoListComponent,
        ValidCrewListComponent,
        InvalidCrewListComponent,
        InvalidPassengersListComponent,
        InvalidCargoListComponent
    ],

    providers: [
        DataExchangeService,
        FileUploadService,
        MasterDataUploadForValidService, 
        MasterDataUploadForInvalidService
    ]
})
export class MasterDataUploadModule { }