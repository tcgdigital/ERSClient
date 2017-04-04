import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterDataUploadComponent } from './masterdata.upload.component';

const actionaleRoutes: Routes = [
    {
        path: '',
        component: MasterDataUploadComponent,
    }
];

export const MasterDataUploadRouting: ModuleWithProviders
    = RouterModule.forChild(actionaleRoutes);