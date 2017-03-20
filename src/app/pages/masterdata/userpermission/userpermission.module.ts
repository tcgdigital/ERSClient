import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { UserPermissionRouting } from './userpermission.routing';
import { UserPermissionComponent } from './userpermission.component';
import { UserPermissionService } from './components';
import { UserProfileService } from '../userprofile';
import { DepartmentService } from '../department';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        UserPermissionRouting
    ],
    declarations: [
        UserPermissionComponent
    ],
    providers: [
        UserProfileService,
        DepartmentService,
        DataExchangeService,
        UserPermissionService
    ]
})
export class UserPermissionModule { }