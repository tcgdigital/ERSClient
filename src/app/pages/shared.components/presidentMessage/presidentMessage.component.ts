import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';


@Component({
    selector: 'presidentMessage-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/presidentMessage.view.html',
    styleUrls: ['./styles/presidents.message.style.scss']
})
export class PresidentMessageComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'PresidentMessages').subtab;
    }
}
