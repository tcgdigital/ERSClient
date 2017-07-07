import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { FutureTravelQueryRouting } from './future.travel.query.routing';
import { FutureTravelQueryComponent } from './future.travel.query.components';
import { FutureTravelQueryAssignedCallsListComponent, FutureTravelQueryRecievedCallsListComponent } from './components';
import { EnquiryService, CallCentreModule } from '../call.centre';
import { CommunicationLogService } from '../communicationlogs';

import { CallCenterOnlyPageService } from '../../callcenteronlypage/component';
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
        CallCentreModule,
        FutureTravelQueryRouting
    ],
    declarations: [
        FutureTravelQueryComponent,
        FutureTravelQueryAssignedCallsListComponent,
        FutureTravelQueryRecievedCallsListComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService,
        CommunicationLogService
    ]
})
export class FutureTravelQueryModule { }