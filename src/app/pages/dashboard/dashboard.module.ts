import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { WidgetModule } from '../widgets';
import { IncidentService } from '../incident';
import { DepartmentService } from '../masterdata/department';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import {
    FlightService,
    InvolvePartyService,
    OrganizationService,
    AircraftTypeService
} from '../shared.components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        HttpModule,
        SharedModule,
        WidgetModule,
        DashboardRouting,
        ModalModule.forRoot(),
    ],
    declarations: [
        DashboardComponent
    ],
    providers: [
        IncidentService,
        DepartmentService,
        FlightService,
        InvolvePartyService,
        OrganizationService,

        AircraftTypeService
    ]
})
export class DashboardModule { }