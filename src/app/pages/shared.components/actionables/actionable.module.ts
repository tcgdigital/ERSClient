import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ActionableRouting } from './actionable.routing';
import { ActionableComponent } from './actionable.component';
import {
    ActionableActiveComponent,
    ActionableClosedComponent, ActionableService
} from './components';
import { DepartmentService, EmergencyTypeService } from '../../masterdata';
import { DataExchangeService, FileUploadService, SharedModule } from '../../../shared';
import { InvolvePartyService } from '../../shared.components/involveparties';
import { FlightService } from '../../shared.components/flights';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        ActionableRouting,
        MdCheckboxModule,
        MomentModule,
        SharedModule,
        ModalModule
    ],
    declarations: [
        ActionableActiveComponent,
        ActionableClosedComponent,
        ActionableComponent
    ],
    providers: [
        ActionableService,
        DepartmentService,
        InvolvePartyService,
        FlightService,
        EmergencyTypeService,
        DataExchangeService,
        FileUploadService
    ]
})
export class ActionableModule { }