import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { EmergencySituationService } from './components';
import { DataExchangeService } from '../../../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule
    ],
    declarations: [
    ],
    providers: [
        EmergencySituationService,
        DataExchangeService
    ]
})
export class FlightEmergencySituationModule { }