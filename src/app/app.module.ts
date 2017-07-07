import { NgModule, ApplicationRef, ComponentRef, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {
    removeNgStyles, createNewHosts,
    createInputTransfer
} from '@angularclass/hmr';
import { Ng2BootstrapModule, ModalModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';

import { routing } from './app.routing';
import { SharedModule } from './shared';
import { PagesModule } from './pages/pages.module';

// Platform and Environment providers/directives/pipes
import { AppStateService } from './app.state.service';
// import { GlobalStateService } from './shared/services/global.state.service';

// App is our top level component
import { AppComponent } from './app.component';

// Application wide providers
const APP_PROVIDERS = [
    AppStateService
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        Ng2BootstrapModule.forRoot(),
        ModalModule.forRoot(),
        SharedModule.forRoot(),
        ToastrModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA7flhwfs8nIwqnisopkJAu77ettcUPAYM'
        }),
        PagesModule,
        routing
    ],
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        APP_PROVIDERS
    ]
})
export class AppModule {
    constructor(public appRef: ApplicationRef, public appState: AppStateService) {
    }

    hmrOnInit(store: StoreType) {
        if (!store || !store.state) return;
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            const restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components
            .map((cmp: ComponentRef<any>) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }
}

