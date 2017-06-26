import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserProfileService } from './userprofile.service';
import { UserProfileModel } from './userprofile.model';
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../../shared';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'userprofile-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.list.view.html'
})
export class UserProfileListComponent implements OnInit, OnDestroy {
    userProfiles: UserProfileModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    userProfilePatch: UserProfileModel = null;

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>) { }

    getUserProfiles(): void {
        this.userProfileService.GetAll()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userProfiles = response.Records;
                this.userProfiles.map((item: UserProfileModel) => {
                    item.isActive = (item.ActiveFlag == 'Active');
                });
            });
    }

    onUserProfileSuccess(data: UserProfileModel): void {
        this.getUserProfiles();
    }

    UpdateUserProfile(userProfileModelUpdate: UserProfileModel): void {
        let userProfileModelToSend = Object.assign({}, userProfileModelUpdate)
        this.dataExchange.Publish("UserProfileModelToBeModified", userProfileModelToSend);
    }

    ngOnInit(): any {
        this.getUserProfiles();
        this.initiateSearchConfigurations();
        this.dataExchange.Subscribe("UserProfileModelCreated", model => this.onUserProfileSuccess(model));
        this.dataExchange.Subscribe("UserProfileModelModified", model => this.onUserProfileSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelCreated');
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }

    checkChange(event: any, editedUderProfile: UserProfileModel): void {
        this.userProfilePatch = new UserProfileModel();
        this.userProfilePatch.deleteAttributes();
        this.userProfilePatch.UserProfileId = editedUderProfile.UserProfileId;
        this.userProfilePatch.ActiveFlag = 'Active';
        this.userProfilePatch.isActive = true;
        if (!event.checked) {
            this.userProfilePatch.isActive = false;
            this.userProfilePatch.ActiveFlag = 'InActive';
        }
        this.userProfileService.Update(this.userProfilePatch)
            .subscribe((response: UserProfileModel) => {
                this.getUserProfiles();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    checkChangeVolunteered(event: any, editedUderProfile: UserProfileModel): void {
        this.userProfilePatch = new UserProfileModel();
        this.userProfilePatch.deleteAttributes();
        this.userProfilePatch.UserProfileId = editedUderProfile.UserProfileId;
        this.userProfilePatch.isVolunteered = event.checked;
        this.userProfileService.Update(this.userProfilePatch)
            .subscribe((response: UserProfileModel) => {
                this.getUserProfiles();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            if (query.indexOf('isActive') >= 0) {
                if (query.indexOf("'true'") >= 0)
                    query = query.replace("'true'", "true");
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", "false");
            }
            this.userProfileService.GetQuery(query)
                .subscribe((response: ResponseModel<UserProfileModel>) => {
                    this.userProfiles = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
        else {
            this.getUserProfiles();
        }
    }

    invokeReset(): void {
        this.getUserProfiles();
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<boolean>[] = [
            new NameValue<boolean>('Active', true),
            new NameValue<boolean>('In Active', false)
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'UserId',
                Description: 'User Id',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Name',
                Description: 'Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Email',
                Description: 'Email',
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
            }),
            new SearchTextBox({
                Name: 'Location',
                Description: 'Location',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'isActive',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];
    }
}