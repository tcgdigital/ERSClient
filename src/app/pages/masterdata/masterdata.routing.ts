import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterDateComponent } from './masterdata.component';

const pageRoutes: Routes = [
    {
        path: '',
        component: MasterDateComponent,
        children: [
            { path: 'department', loadChildren: './department/department.module#DepartmentModule' },
            { path: 'checklist', loadChildren: './checklist/checklist.module#ChecklistModule' },
            { path: 'demandtype', loadChildren: './demandtype/demandtype.module#DemandTypeModule' },
            { path: 'emergencytype', loadChildren: './emergencytype/emergencytype.module#EmergencyTypeModule' },
            { path: 'quicklink', loadChildren: './quicklink/quicklink.module#QuickLinkModule' },
            { path: 'emergencydepartment', loadChildren: './emergency.department/emergency.department.module#EmergencyDepartmentModule' },
            { path: 'departmentfunctionality', loadChildren: './department.functionality/department.functionality.module#DepartmentFunctionalityModule' }
        ]
    }
];

export const MasterDateRouting: ModuleWithProviders
    = RouterModule.forChild(pageRoutes);