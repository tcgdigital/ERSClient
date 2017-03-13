import { BaseModel } from '../../../../shared';

export class UserProfileModel extends BaseModel {
    public UserProfileId: number;
    public UserId: string;
    public IgaCode: string;
    public Name: string;
    public Email: string;
    public Designation: string;
    public DepartmentCode: string;
    public DepartmentName: string;
    public Location: string;
    public DateOfJoining?: Date;
    public DateOfBirth?: Date;
    public ManagerName: string;
    public ManagerEmailId: string;
    public Gender: string;
    public DoRes: string;
    public DoRel: string;
    public EmployeeGroup: string;
    public EmployeeSubGroup: string;
    public Grade: string;
    public HOD: string;
    public LastPromotionDate?: Date;
    public MainContact: string;
    public PersonalEmailId: string;
    public ConfirmationDate?: Date;
    public EmployementStatus: string;
    public AlternateContact: string;
    public DeviceId: string;
    public RegistrationId: string;
    public DeviceOS: string;
    public ResignedOn?: Date;
    public isActive: boolean;

    constructor(){
        super();
        this.UserProfileId = 0;
    }
}