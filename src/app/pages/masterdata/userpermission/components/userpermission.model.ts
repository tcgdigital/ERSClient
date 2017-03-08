import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';
import { UserProfileModel } from '../../userprofile'

export class UserPermissionModel extends BaseModel {
    public UserPermissionId: number;
    public DepartmentId: number;
    public UserId: number;
    public IsMemberOf: boolean;
    public IsHod: boolean;


    public UserProfile: UserProfileModel;
    public Department: DepartmentModel;
}

export class DepartmentsToView extends BaseModel {
    public UserId: number;
    public DepartmentId: number;
    public DepartmentName: string;
    public IsMemberOf: boolean;
    public IsHod: boolean;
}