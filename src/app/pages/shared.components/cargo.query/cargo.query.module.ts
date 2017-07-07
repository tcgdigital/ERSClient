import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { CargoQueryRouting } from './cargo.query.routing';
import { CargoQueryComponent } from './cargo.query.components';
import { CargoQueryAssignedCallsListComponent, CargoQueryRecievedCallsListComponent } from './components';
import { CallCentreModule, EnquiryService } from '../call.centre';
import { CommunicationLogService } from '../communicationlogs';

import { CallCenterOnlyPageModule, CallCenterOnlyPageService } from '../../callcenteronlypage';
import { DataExchangeService, SharedModule } from '../../../shared';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        ModalModule,
        CargoQueryRouting,
        CallCentreModule
    ],
    declarations: [
        CargoQueryComponent,
        CargoQueryAssignedCallsListComponent,
        CargoQueryRecievedCallsListComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService,
        CommunicationLogService
    ]
})
export class CargoQueryModule { }