import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ActionableService } from '../shared.components/actionables';
import { DepartmentClosureRouting } from './department.closure.routing';
import { DepartmentClosureComponent } from './department.closure.component';
import { DepartmentClosureService } from './components';
import { DepartmentService } from '../masterdata';
import {
    SharedModule, DataExchangeService,
    LocationService, GlobalStateService
} from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule,
        AgmCoreModule,
        DepartmentClosureRouting,
        ModalModule.forRoot(),
    ],
    declarations: [
        DepartmentClosureComponent
    ],
    providers: [
        DepartmentClosureService,
        DepartmentService,
        ActionableService,
        ToastrService,
        DataExchangeService,
        LocationService
    ]
})
export class DepartmentClosureModule { }