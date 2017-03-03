import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionableComponent } from './actionable.component';

const actionaleRoutes: Routes = [
    {
        path: '',
        component: ActionableComponent,
    }
];

export const ActionableRouting: ModuleWithProviders
    = RouterModule.forChild(actionaleRoutes);