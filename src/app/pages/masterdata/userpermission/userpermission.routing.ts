import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPermissionComponent } from './userpermission.component';

const userPermissionRoutes: Routes = [
    {
        path: '',
        component: UserPermissionComponent,
    }
];

export const UserPermissionRouting: ModuleWithProviders
    = RouterModule.forChild(userPermissionRoutes);