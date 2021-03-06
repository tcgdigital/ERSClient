import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { TemplateRouting } from './template.routing';
import { TemplateComponent } from './template.component';
import { TemplateListComponent, TemplateService } from './components';
import { EmergencySituationService } from '../emergency.situation/components';
import { DataExchangeService,SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        TemplateRouting,
        MdCheckboxModule,
        SharedModule
    ],
    declarations: [
        TemplateListComponent,
        TemplateComponent
    ],
    providers: [
        TemplateService,
        DataExchangeService,
        EmergencySituationService
    ]
})
export class TemplateModule { }