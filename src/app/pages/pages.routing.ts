import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared/services';
import { PagesComponent } from './pages.component';

const pageRoutes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/login/login.module#LoginModule'
    },
    {
        path: 'licensing',
        loadChildren: './licensing/licensing.module#LicensingModule'
    },
    {
        path: 'pages',
        component: PagesComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        children: [
            { path: '', redirectTo: 'pages/dashboard/people/detail', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'landing', loadChildren: './landing/landing.module#LandingModule' },
            { path: 'archivelist', loadChildren: './archive.list/archive.dashboard.list.module#ArchiveDashboardListModule' },
            { path: 'archivedashboard', loadChildren: './archive.dashboard/archive.dashboard.module#ArchiveDashboardModule' },
            { path: 'masterdata', loadChildren: './masterdata/masterdata.module#MasterDateModule' },
            { path: 'incident', loadChildren: './incident/incident.module#IncidentModule' },
            { path: 'uploaddata', loadChildren: './masterdata.upload/masterdata.upload.module#MasterDataUploadModule' },
            { path: 'notifypeople', loadChildren: './notifypeople/notifypeople.module#NotifyPeopleModule' },
            { path: 'departmentclosure', loadChildren: './department.closure/department.closure.module#DepartmentClosureModule' },
            { path: 'emergencyclosure', loadChildren: './emergency.closure/emergency.closure.module#EmergencyClosureModule' },
            { path: 'notifypeople', loadChildren: './notifypeople/notifypeople.module#NotifyPeopleModule' },
            { path: 'archivedashboard', loadChildren: './archive.dashboard/archive.dashboard.module#ArchiveDashboardModule' },
            { path: 'callcenteronlypage', loadChildren: './callcenteronlypage/callcenteronlypage.module#CallCenterOnlyPageModule' },
            { path: 'membertrack', loadChildren: './member.track/member.track.module#MemberTrackModule' },
            { path: 'javascript:alert("Hello");', loadChildren: '' }
        ]
    }
];

export const PagesRouting: ModuleWithProviders = RouterModule.forChild(pageRoutes);