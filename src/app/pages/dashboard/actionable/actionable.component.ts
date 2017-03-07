import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActionableModel } from '../actionable';
import { DataExchangeService } from '../../../shared';

@Component({

    selector: 'actionable-main',
   
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/actionable.html'
})
export class ActionableComponent implements OnInit, OnDestroy {
    showActive: boolean = null;
    showClose: boolean = null;
    IsOpenActionable:boolean = null;
    actionable: ActionableModel;
    constructor(private dataExchange: DataExchangeService<boolean>) {


    }
    ngOnInit(): any {
        this.IsOpenActionable=true;
        this.showActive = true;
        this.showClose = false;
    }
    ngOnDestroy(): void {

    }

    OpenActionable(event: any): void {
        console.log(event.checked);
        if (event.checked) {
            this.showActive = true;
            this.showClose = false;
            this.dataExchange.Publish("OpenActionablePageInitiate", true);
        }
        else {
            this.showActive = false;
            this.showClose = true;
            this.dataExchange.Publish("CloseActionablePageInitiate", true);
        }
    }

}