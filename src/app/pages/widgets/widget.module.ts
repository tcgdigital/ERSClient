import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';
import { SharedModule } from '../../shared';

import {
    AffectedPeopleService,
    EnquiryService,
    ActionableService
} from '../shared.components';

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
    PresidentMessageWidgetService
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
    ActionableService
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        ModalModule.forRoot(),        
        SharedModule,
        RouterModule
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
