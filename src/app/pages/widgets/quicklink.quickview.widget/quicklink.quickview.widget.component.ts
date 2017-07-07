import {
    Component, OnInit, Input, ViewChild,
    Output, EventEmitter, ViewEncapsulation,
    SimpleChange
} from '@angular/core';
import { KeyValue, ResponseModel } from '../../../shared/models';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QuickLinkModel } from '../../masterdata/quicklink/components';
import { QuickLinkService } from '../../masterdata/quicklink/components';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'quick-link-widget',
    templateUrl: './quicklink.quickview.widget.view.html',
    styleUrls: ['./quicklink.quickview.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class QuickLinkQuickViewWidgetComponent implements OnInit {
    @Input() currentIncident: number;
    public incidentId: number;
    quicklinks: QuickLinkModel[] = [];
    constructor(private quicklinkService: QuickLinkService) { }

    ngOnInit() {
        this.incidentId = 0;
        this.getQuickLinks();
    }

    getQuickLinks(): void {
        this.quicklinkService.GetAll()
            .subscribe((response: ResponseModel<QuickLinkModel>) => {
                this.quicklinks = response.Records;
            });
    }
}