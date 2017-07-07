import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { IncidentModel } from '../incident';

import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'incident-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/incident.html'
})
export class IncidentComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): any {
    }

    ngOnDestroy(): void {
    }
}