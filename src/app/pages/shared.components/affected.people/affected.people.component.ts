import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'affectedpeople-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.people.view.html',
    styleUrls: ['./styles/affected.people.style.scss']
})
export class AffectedPeopleComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'AffectedPeople').subtab;
    }
}