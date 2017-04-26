import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NotificationService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        NotificationService,
        DataExchangeService
    ]
})
export class NotificationModule { }