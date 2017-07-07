import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { LandingRouting } from './landing.routing';
import { LandingComponent } from './landing.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        AgmCoreModule,
        LandingRouting,
    ],
    declarations: [
        LandingComponent
    ]
})
export class LandingModule { }