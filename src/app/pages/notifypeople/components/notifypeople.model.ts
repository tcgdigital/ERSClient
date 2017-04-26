import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { UserProfileModel } from "../../masterdata/userprofile";
export class NotifyPeopleModel extends BaseModel {
    public id: number;
    public text: string;
    public population: string;
    public checked: boolean;
    public children: NotifyPeopleModel[];
    public User: UserProfileModel;
    public DepartmentId: number;

    constructor() {
        super();
        this.id = 0;
        this.text = '';
        this.population = '';
        this.checked = false;
        this.children = [];
        this.User = new UserProfileModel();
        this.DepartmentId = 0;
    }
}

export class NotificationContactsWithTemplateModel extends BaseModel {
    public UserId: number;
    public IsActive: boolean;
    public IncidentId: number;
    public DepartmentId: number;
    public CreatedBy: number;
    public UserName: string;
    public SituationId: number;
    public AttachmentSingle: string;
    public ContactNumber: string;
    public AlternetContactNumber: string;
    public EmailId: string;
    public Message: string;
    // public Attachment: string;
    // public Data: string;

    constructor() {
        super();
        this.UserId = 0;
        this.IsActive = false;
        this.IncidentId = 0;
        this.DepartmentId = 0;
        this.CreatedBy = 0;
        this.UserName = '';
        this.SituationId = 0;
        this.IncidentId = 0;
        this.AttachmentSingle = '';
        this.ContactNumber = '';
        this.AlternetContactNumber = '';
        this.EmailId = '';
        this.Message = '';

    }
}



