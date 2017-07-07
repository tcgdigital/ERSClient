import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';
import * as _ from 'underscore';

@Component({

    selector: 'actionable-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/actionable.html',
    styleUrls: ['./styles/actionable.style.scss']
})
export class ActionableComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'Actionables').subtab;
    }
}