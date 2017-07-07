import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { DemandeRouting } from './demand.routing';
import { DemandComponent } from './demand.component';
import {
    DemandService, ApprovedDemandComponent, AssignedDemandComponent,
    CompletedDemandComponent, MyDemandComponent, DemandEntryComponent, DemandRemarkLogService, DemandTrailService
} from './components';
import { AffectedPeopleService, AffectedObjectsService } from '../../shared.components';
import { CallerService } from '../caller';
import { DemandTypeService } from '../../masterdata/demandtype';
import { InvolvePartyService } from '../involveparties';
import { DepartmentService } from '../../masterdata/department';
import { PageService } from '../../masterdata/department.functionality';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadService } from '../../../shared';
import { FileStoreService } from '../../../shared/services/common.service';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        DemandeRouting,
        ModalModule

    ],
    declarations: [
        DemandComponent,
        ApprovedDemandComponent,
        CompletedDemandComponent,
        AssignedDemandComponent,
        MyDemandComponent,
        DemandEntryComponent
    ],
    providers: [
        DemandService,
        DemandTypeService,
        DepartmentService,
        AffectedObjectsService,
        AffectedPeopleService,
        PageService,
        DemandRemarkLogService,
        CallerService,
        DemandTrailService,
        InvolvePartyService,
        FileUploadService,
        FileStoreService

    ]
})
export class DemandModule { }