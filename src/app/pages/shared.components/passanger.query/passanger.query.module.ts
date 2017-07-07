import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { PassangerQueryRouting } from './passanger.query.routing';
import { PassangerQueryComponent } from './passanger.query.components';
import {
    PassangerQueryAssignedCallsListComponent,
    PassangerQueryRecievedCallsListComponent
} from './components';
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
        PassangerQueryRouting
    ],
    declarations: [
        PassangerQueryComponent,
        PassangerQueryRecievedCallsListComponent,
        PassangerQueryAssignedCallsListComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService,
        CommunicationLogService
    ]
})
export class PassengerQueryModule { }