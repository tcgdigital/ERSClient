import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { DepartmentFunctionalityeRouting } from './department.functionality.routing';
import { DepartmentFunctionalityComponent } from './department.functionality.component';
import { PageService, PagePermissionService } from './components';
import { DepartmentService } from '../department';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        DepartmentFunctionalityeRouting
    ],
    declarations: [
        DepartmentFunctionalityComponent
    ],
    providers: [
        PageService, 
        PagePermissionService,
        DepartmentService,
        DataExchangeService
    ]
})
export class DepartmentFunctionalityModule { }