import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { AppendedTemplateService } from './components';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        MdCheckboxModule
    ],
    declarations: [
    ],
    providers: [
        AppendedTemplateService,
        DataExchangeService
    ]
})
export class AppendedTemplateModule { }