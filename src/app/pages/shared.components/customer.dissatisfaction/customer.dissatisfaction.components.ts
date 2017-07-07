import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/customer.dissatisfaction.view.html'
})
export class CustomerDissatisfactionComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CustomerDissatisfactionQuery').subtab;
    }
}