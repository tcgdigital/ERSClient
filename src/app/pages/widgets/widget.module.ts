import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AffectedPeopleService } from '../shared.components/affected.people';
import { EnquiryService } from '../shared.components/call.centre';
import { ActionableService } from '../shared.components/actionables';
import { DemandService } from '../shared.components/demand';
import { DepartmentAccessOwnerService } from '../shared.components/departmentaccessowner';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { SharedModule, FileUploadService } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from '../../shared';
import {
    BroadcastWidgetComponent,
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandReceivedSummaryWidgetComponent,
    DemandRaisedSummaryWidgetComponent,
    MediaReleaseWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent,
    IncidentHeaderWidgetComponent,
    ReadOnlyIncidentWidgetComponent,
    ArchiveReportWidgetComponent,
    ArchiveUploadWidgetComponent
} from './index';

import {
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandReceivedSummaryWidgetService,
    DemandRaisedSummaryWidgetService,
    MediaReleaseWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService,
    ArchiveReportWidgetService,
    ArchiveDocumentTypeService,
    DepartmentClosureService
} from './index';

const WIDGET_COMPONENTS: any[] = [
    BroadcastWidgetComponent,
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandReceivedSummaryWidgetComponent,
    DemandRaisedSummaryWidgetComponent,
    MediaReleaseWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent,
    IncidentHeaderWidgetComponent,
    ReadOnlyIncidentWidgetComponent,
    ArchiveReportWidgetComponent,
    ArchiveUploadWidgetComponent

];

const WIDGET_SERVICE: any[] = [
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandReceivedSummaryWidgetService,
    DemandRaisedSummaryWidgetService,
    MediaReleaseWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService,
    AffectedPeopleService,
    EnquiryService,
    ActionableService,
    DemandService,
    DepartmentAccessOwnerService,
    ArchiveReportWidgetService,
    ArchiveDocumentTypeService,
    DepartmentClosureService,
    FileUploadService,
    UtilityService
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        ModalModule.forRoot(),
        SharedModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ...WIDGET_COMPONENTS
    ],
    declarations: [
        ...WIDGET_COMPONENTS
    ],
    providers: [
        ...WIDGET_SERVICE
    ],
})
export class WidgetModule { }
