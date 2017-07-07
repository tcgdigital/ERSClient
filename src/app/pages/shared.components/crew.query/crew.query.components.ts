import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/crew.query.view.html'
})
export class CrewQueryComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CrewQuery').subtab;
    }
}