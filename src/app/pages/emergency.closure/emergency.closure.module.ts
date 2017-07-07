import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';

import { EmergencyClosureRouting } from './emergency.closure.routing';
import { EmergencyClosureComponent } from './emergency.closure.component';
import { DepartmentClosureService } from '../department.closure/components/department.closure.service';
import { IncidentService } from '../incident/components/incident.service';
import { DepartmentService } from '../masterdata/department/components/department.service';
import { EmergencyTypeDepartmentService } from '../masterdata/emergency.department/components/emergency.department.service';
import { NotifyPeopleService } from '../notifypeople/components/notifypeople.service';
import { UserPermissionService } from '../masterdata/userpermission/components/userpermission.service';
import { TemplateService } from '../masterdata/template/components';
import { ActionableService } from '../shared.components/actionables/components/actionable.service';
import { UserdepartmentNotificationMapperService } from '../shared.components/userdepartmentnotificationmapper';

import { DemandService } from '../shared.components/demand/components/demand.service';
import { DepartmentAccessOwnerService } from '../shared.components/departmentaccessowner';
import { AppendedTemplateService } from '../masterdata/appendedtemplate/components';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EmergencyClosureService } from './components/emergency.closure.service';
import { AuthenticationService } from '../login/components/authentication.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        SharedModule,
        EmergencyClosureRouting,
        MdCheckboxModule,
        ModalModule
    ],
    declarations: [
        EmergencyClosureComponent
    ],
    providers: [
        NotifyPeopleService,
        DepartmentClosureService,
        EmergencyTypeDepartmentService,
        IncidentService,
        DepartmentService,
        UserPermissionService,
        ActionableService,
        DemandService,
        DepartmentAccessOwnerService,
        EmergencyClosureService,
        AuthenticationService,
        TemplateService,
        AppendedTemplateService,
        UserdepartmentNotificationMapperService
    ]
})
export class EmergencyClosureModule { }