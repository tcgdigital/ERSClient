import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.view.html',
    styleUrls: ['./styles/media.style.scss']
})
export class MediaComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'MediaManagement').subtab;
    }
}