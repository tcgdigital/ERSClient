import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'affectedobject-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.objects.view.html',
    styleUrls: ['./styles/affected.objects.style.scss']
})
export class AffectedObjectsComponent implements OnInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'AffectedObjects').subtab;
    }
}