import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfoComponent } from './contact.info.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ModalModule,
        SharedModule
    ],
    declarations: [ContactInfoComponent],
    providers: []
})
export class ContactInfoModule {
}