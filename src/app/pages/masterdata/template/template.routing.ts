import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplateComponent } from './template.component';

const templateRoutes: Routes = [
    {
        path: '',
        component: TemplateComponent,
    }
];

export const TemplateRouting: ModuleWithProviders
    = RouterModule.forChild(templateRoutes);