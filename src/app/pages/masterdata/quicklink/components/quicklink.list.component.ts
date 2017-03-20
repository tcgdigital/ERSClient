import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { QuickLinkModel } from './quicklink.model';
import { QuickLinkService } from './quicklink.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'quicklink-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/quicklink.list.view.html',
    styleUrls: ['../styles/quicklink.style.scss']
})
export class QuickLinkListComponent implements OnInit, OnDestroy {
    vari: any = null;
    quicklinks: QuickLinkModel[] = [];
    quickLinkModelPatch: QuickLinkModel = null;
    date: Date = new Date();

    constructor(private quicklinkService: QuickLinkService,
        private dataExchange: DataExchangeService<QuickLinkModel>) { }

    initiateQuickLinkModelPatch(): void {
        this.quickLinkModelPatch = new QuickLinkModel();
        this.quickLinkModelPatch.ActiveFlag = 'Active';
        this.quickLinkModelPatch.CreatedBy = 1;
        this.quickLinkModelPatch.CreatedOn = this.date;
    }

    getQuickLinks(): void {
        this.quicklinkService.GetAll()
            .subscribe((response: ResponseModel<QuickLinkModel>) => {
                this.quicklinks = response.Records;
            });
    }

    onQuickLinkSaveSuccess(data: QuickLinkModel): void {
        this.quicklinks.unshift(data);
    }

    ngOnInit(): void {
        this.getQuickLinks();
        this.dataExchange.Subscribe("quickLinkModelSaved", 
            model => this.onQuickLinkSaveSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("quickLinkModelSaved");
    }

    editQuickLink(editedQuickLink: QuickLinkModel): void {
        this.dataExchange.Publish("quickLinkModelEdited", editedQuickLink);
    }

    IsActive(event: any, editedQuickLink: QuickLinkModel): void {
        this.initiateQuickLinkModelPatch();
        this.quickLinkModelPatch.QuickLinkId = editedQuickLink.QuickLinkId;
        this.quickLinkModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.quickLinkModelPatch.ActiveFlag = 'InActive';
        }
        this.quicklinkService.Update(this.quickLinkModelPatch)
            .subscribe((response: QuickLinkModel) => {
                this.getQuickLinks();
            }, (error: any) => {
                console.log("Error");
            });
    }
}