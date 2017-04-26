import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentClosureComponent } from './department.closure.component';

const departmentClosureRoutes: Routes = [
    {
        path: '',
        component: DepartmentClosureComponent,
    }
];

export const DepartmentClosureRouting: ModuleWithProviders
    = RouterModule.forChild(departmentClosureRoutes);