import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';
import { NotifyPeopleRouting } from './notifypeople.routing';
import { NotifyPeopleComponent } from './notifypeople.component';
import { NotifyPeopleService } from './components';
import { DataExchangeService, SharedModule } from '../../shared';
import { UserPermissionService } from '../masterdata/userpermission/components/userpermission.service';
import { UserdepartmentNotificationMapperService } from "../shared.components/userdepartmentnotificationmapper";
import { TemplateService } from "../masterdata/template";
import { AppendedTemplateService } from "../masterdata/appendedtemplate";
import { IncidentService } from "../incident";
import { DepartmentService } from "../masterdata/department";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        SharedModule,
        NotifyPeopleRouting
    ],
    declarations: [
        NotifyPeopleComponent
    ],
    providers: [
        NotifyPeopleService,
        TemplateService,
        AppendedTemplateService,
        UserdepartmentNotificationMapperService,
        IncidentService,
        ToastrService,
        DepartmentService,
        DataExchangeService,
        UserPermissionService
    ]
})
export class NotifyPeopleModule { }