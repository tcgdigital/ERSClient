import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaQueryComponent } from './media.query.components';
import { MediaQueryAssignedCallsListComponent, MediaQueryRecievedCallsListComponent } from "./components";


const mediaQueryRoutes: Routes = [

    {

        path: '',
        component: MediaQueryComponent,
        children: [
            {
                path: '',
                component: MediaQueryAssignedCallsListComponent
            },
            {
                path: 'assignedcalls',
                component: MediaQueryRecievedCallsListComponent
            },
            {
                path: 'recievedCalls',
                component: MediaQueryAssignedCallsListComponent
            }]
    }];

export const MediaQueryRouting: ModuleWithProviders
    = RouterModule.forChild(mediaQueryRoutes);