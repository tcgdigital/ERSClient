import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


import { InvolvePartyModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, UtilityService, KeyValue
} from '../../../../shared';
import { InvolvePartyService } from '../../involveparties';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.verification.html'
})
export class AffectedPeopleVerificationComponent implements OnInit {
    constructor(private affectedPeopleService: AffectedPeopleService,
        private involvedPartyService: InvolvePartyService, private globalState: GlobalStateService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) { }

    affectedPeopleForVerification: AffectedPeopleToView[] = [];
    verifiedAffectedPeople: AffectedPeopleModel[];
    date: Date = new Date();
    currentIncident: number;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    allSelectVerify: boolean;

    getAffectedPeople(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeopleForVerification = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                this.isVerfiedChange();
         }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    saveVerifiedAffectedPeople(): void {
        let datenow = this.date;
        this.verifiedAffectedPeople = this.affectedPeopleService.MapAffectedPeople(this.affectedPeopleForVerification);
        this.affectedPeopleService.CreateBulk(this.verifiedAffectedPeople)
            .subscribe((response: AffectedPeopleModel[]) => {
                this.toastrService.success('Selected People directly affected are verified.', 'Success', this.toastrConfig);
                this.getAffectedPeople(this.currentIncident);

            }, (error: any) => {
                alert(error);
            });
    };
 selectAllVerify(value: any) : void{
       this.affectedPeopleForVerification.forEach((x:AffectedPeopleToView) =>{
                x.IsVerified = value.checked;
       });
  }
    isValidView(item: AffectedPeopleToView) {
        return (item.IsVerified == true );
    };

    isVerfiedChange():void{
        this.allSelectVerify = this.affectedPeopleForVerification.length != 0 && this.affectedPeopleForVerification.filter(x=>{
              return x.IsVerified == true;
          }).length == this.affectedPeopleForVerification.length;
    }

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.getAffectedPeople(this.currentIncident);
    }

    ngOnInit(): any {
        this.allSelectVerify = false;
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAffectedPeople(this.currentIncident);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAffectedPeople(this.currentIncident);
                }
            }
        });
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
    }
}