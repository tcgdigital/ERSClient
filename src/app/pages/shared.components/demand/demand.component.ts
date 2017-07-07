import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

import {
    ApprovedDemandComponent, AssignedDemandComponent,
    CompletedDemandComponent, MyDemandComponent
} from './components';

@Component({
    selector: 'demand-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/demand.view.html',
    styleUrls: ['./styles/demand.style.scss']
})
export class DemandComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'Demand').subtab;
    }
}