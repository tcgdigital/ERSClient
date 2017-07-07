import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {
    GlobalStateService, ResponseModel, SearchConfigModel,
    SearchTextBox
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserProfileService } from '../../masterdata/userprofile/components/userprofile.service';
import { UserProfileModel } from '../../masterdata/userprofile/components';


@Component({
    selector: 'contactinfo',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './contact.info.view.html',
    providers: [UserProfileService]
})
export class ContactInfoComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;

    userprofiles: UserProfileModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];

    constructor(private globalState: GlobalStateService, private userprofileService: UserProfileService) {

    }

    ngOnInit(): any {
        this.initiateSearchConfigurations();
        this.globalState.Subscribe('contactClicked', (model) => this.contactClicked());
    }

    ngOnDestroy() {
        this.globalState.Unsubscribe('contactClicked');
    }

    contactClicked(): void {
        this.userprofileService.GetForDirectory()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userprofiles = response.Records;
                this.childModal.show();
            });
    }

    cancelModal(): void {
        this.childModal.hide();
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.userprofileService.GetQuery(query)
                .subscribe((response: ResponseModel<UserProfileModel>) => {
                    this.userprofiles = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }

    invokeReset(): void {
        this.userprofileService.GetForDirectory()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userprofiles = response.Records;
            });
    }

    private initiateSearchConfigurations(): void {

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'Name',
                Description: 'Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'MainContact',
                Description: 'Main Contact',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'AlternateContact',
                Description: 'Alternate Contact',
                Value: ''
            })
        ];
    }
}