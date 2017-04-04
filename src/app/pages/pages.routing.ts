import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';

const pageRoutes: Routes = [
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'pages',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'masterdata', loadChildren: './masterdata/masterdata.module#MasterDateModule' },
            { path: 'incident', loadChildren: './incident/incident.module#IncidentModule' },
            { path: 'masterdataupload', loadChildren: './masterdata.upload/masterdata.upload.module#MasterDataUploadModule' }
        ]
    }
];

export const PagesRouting: ModuleWithProviders = RouterModule.forChild(pageRoutes);