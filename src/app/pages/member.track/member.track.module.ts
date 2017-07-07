import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ngx-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { MemberTrackRouting } from './member.track.routing';
import { MemberTrackComponent } from './member.track.component';
import { MemberTrackService } from './components/member.track.service';
import { SharedModule } from '../../shared';
import { UserPermissionService } from '../masterdata/userpermission/components/userpermission.service';
import { UserProfileService } from '../masterdata/userprofile/components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule,
        AgmCoreModule,
        MemberTrackRouting,
        ModalModule.forRoot(),
    ],
    declarations: [
        MemberTrackComponent
    ],
    providers: [
        MemberTrackService,
        UserPermissionService,
        UserProfileService
    ],
})
export class MemberTrackModule {    }
