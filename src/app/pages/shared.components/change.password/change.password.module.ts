import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change.password.component';
import { ChangePasswordRouting } from './change.password.routing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        ChangePasswordRouting,
        ModalModule.forRoot()
    ],
    exports: [],
    declarations: [ChangePasswordComponent],
    providers: [],
})
export class ChangePasswordModule { }
