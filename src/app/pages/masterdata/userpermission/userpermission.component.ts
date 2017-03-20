import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { DepartmentService, DepartmentModel } from '../department';
import { UserProfileService, UserProfileModel } from '../userprofile';
import { UserPermissionService } from './components/userpermission.service';
import { UserPermissionModel, DepartmentsToView } from './components/userpermission.model';
import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue } from '../../../shared';

@Component({
    selector: 'user-permission-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/userpermission.view.html'
})
export class UserPermissionComponent {
    userProfileItems: UserProfileModel[] = [];
    departments: DepartmentModel[] = [];
    departmentsToView: DepartmentsToView[] = [];
    departmentsToViewConstant: DepartmentsToView[] = [];
    userPermissionModelToSave: UserPermissionModel[] = [];
    selectedUser: number;
    date: Date = new Date();
    private items: Array<KeyValue> = [];

    constructor(private userPermissionService: UserPermissionService,
        private userProfileService: UserProfileService,
        private departmentService: DepartmentService) { };

    getUserProfiles(): void {
        this.userProfileService.GetAll()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userProfileItems = response.Records;
                this.userProfileItems.forEach(userProfile => {
                    this.items.push(new KeyValue(userProfile.Name, userProfile.UserProfileId));
                });

            }, (error: any) => {
                console.log(error);
            });
    };

    SetAllSelectedToFalse(departmentsToViewModel: DepartmentsToView[]): void {
        departmentsToViewModel.forEach(item => {
            item.IsMemberOf = false;
            item.IsHod = false;
        });
    }

    invokeReset(): void {
        this.departmentsToView = [];
    }

    onNotify(message: KeyValue): void {
        this.selectedUser = message.Value;
        this.userPermissionService.GetFilterByUsers(message.Value)
            .subscribe((response: ResponseModel<UserPermissionModel>) => {
                this.SetAllSelectedToFalse(this.departmentsToViewConstant);
                this.departmentsToView = this.departmentsToViewConstant;

                this.departmentsToView.forEach(departmentToView => {
                    if (response.Count != 0) {
                        let userPermissionObject = response.Records
                            .find(x => {
                                return (x.DepartmentId == departmentToView.DepartmentId);
                            });
                            if(userPermissionObject){
                                departmentToView.IsHod = userPermissionObject.IsHod;
                                departmentToView.IsMemberOf = userPermissionObject.IsMemberOf;
                            }
                    }
                });
            }, (error: any) => {
                console.log(error);
            });
    };

    isHod(item: DepartmentsToView) {
        return item.IsHod == true;
    }

    isMemberOf(item: DepartmentsToView) {
        return item.IsMemberOf == true;
    }

    save(): void {
        let model = this.departmentsToView.filter(this.isMemberOf);
        let selectedUser = this.selectedUser;
        let datenow = this.date;
        console.log(model);
        this.userPermissionModelToSave = model.map(function (data) {
            {
                let item = new UserPermissionModel();
                item.UserId = selectedUser;
                item.DepartmentId = data.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = 1;
                item.CreatedOn = datenow;
                item.IsMemberOf = data.IsMemberOf;
                item.IsHod = data.IsHod;
                return item;
            }
        });
        console.log(this.userPermissionModelToSave);
        this.userPermissionService.CreateBulk(this.userPermissionModelToSave)
            .subscribe((response: UserPermissionModel[]) => {
                console.log("Success");
            }, (error: any) => {
                console.log(error);
            });
    }

    ngOnInit(): any {
        this.getUserProfiles();
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.departmentsToViewConstant=this.userPermissionService
                .CreateDefaultDepartmentList(this.departments);
            }, (error: any) => {
                console.log(error);
            });
    }
}