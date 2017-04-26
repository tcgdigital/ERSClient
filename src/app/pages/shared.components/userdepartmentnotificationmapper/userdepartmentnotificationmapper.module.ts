import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { UserdepartmentNotificationMapperService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        UserdepartmentNotificationMapperService,
        DataExchangeService
    ]
})
export class UserdepartmentNotificationMapperModule { }