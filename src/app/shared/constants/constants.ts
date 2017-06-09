export interface IEmergencySituationEnum {
    EmergencySituationId: number;
    enumtype: string;
    EmergencySituationName: string;
}
export interface IKeyValue {
    value: string;
    key: number;
}
export interface IEnquiryType {
    value: string;
    caption: string;
    text: string;
}

export interface IPriority {
    value: string;
    caption: string;
    text: string;
}
export interface ICompletionStatusType {
    value: string;
    caption: string;
    text: string;
}
export interface IUploadDocuments {
    value: string;
    caption: string;
    text: string;
}
export interface IMedicalStatus {
    key: number;
    value: string;
    caption: string;
}
export interface IRequesterType {
    value: string;
    enumtype: string;
    caption: string;
}
export interface IActionableStatus {
    key: number;
    value: string;
    caption: string;
}

export class GlobalConstants {
    // public static EXTERNAL_URL: string = 'http://202.54.73.219:86/';
    public static EXTERNAL_URL: string = 'http://localhost:5001/';
    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch';
    public static ACCESS_TOKEN: string = 'access_token';
    public static AD_AUTH_ENABLED: boolean = false;
    public static PASSWORD_PATTERN: string = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})';
    public static LAST_INCIDENT_PICK_COUNT: string = '5';
    public static ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION: number = 12;

    public static INTERCEPTOR_PERFORM: boolean = false;
    public static PRESERVE_DATA_FROM_CONVERSION = ['EmergencyDate'];

    public static LicenseValidationCode: IKeyValue[] = [
        { key: 101, value: 'License is valid' },
        { key: 102, value: 'License info file not found'},
        { key: 103, value: 'License info file is invalid or corrupted'},
        { key: 104, value: 'Current machine is not registered with the license'},
        { key: 105, value: 'License key is invalid or not provided'},
        { key: 106, value: 'License has expired'}
    ]

    public static EmergencyCategories: IKeyValue[] = [
        { value: 'FlightRelated', key: 1 },
        { value: 'NonFlightRelated', key: 2 }
    ];

    public static MediaReleaseStatuses: IKeyValue[] = [
        { value: 'Saved', key: 1 },
        { value: 'SentForApproval', key: 2 },
        { value: 'Approved', key: 3 },
        { value: 'Published', key: 4 }
    ];

    public static ActiveFlag: IKeyValue[] = [
        { value: 'Active', key: 0 },
        { value: 'InActive', key: 1 }
    ];

    public static TemplateMediaType: IKeyValue[] = [
        { value: 'Sms', key: 1 },
        { value: 'PushNotification', key: 2 },
        { value: 'Email', key: 3 },
        { value: 'Pdf', key: 4 }
    ];

    public static EnquiryType: IEnquiryType[] = [
        {
            value: '1',
            caption: 'Passenger',
            text: 'Passenger related'
        },
        {
            value: '2',
            caption: 'Cargo',
            text: 'Cargo related'
        },
        {
            value: '3',
            caption: 'Media',
            text: 'Media related',
        },
        {
            value: '4',
            caption: 'Others',
            text: 'Others',
        },
        {
            value: '5',
            caption: 'Crew',
            text: 'Crew',
        }];

    public static ExternalInputEnquiryType: IEnquiryType[] = [
        {
            value: '1',
            caption: 'Passenger',
            text: 'Passenger enquiry'
        },
        {
            value: '2',
            caption: 'Cargo',
            text: 'Cargo enquiry'
        },
        {
            value: '3',
            caption: 'Crew',
            text: 'Crew enquiry',
        },
        {
            value: '4',
            caption: 'Media',
            text: 'Media enquiry',
        },
        {
            value: '5',
            caption: 'FutureTravel',
            text: 'Future Travel enquiry',
        },
        {
            value: '6',
            caption: 'GeneralUpdate',
            text: 'General Update enquiry',
        },
        {
            value: '7',
            caption: 'Others',
            text: 'Other enquiry',
        },
        {
            value: '8',
            caption: 'SituationalUpdates',
            text: 'Situational Updates enquiry',
        },
        {
            value: '9',
            caption: 'CustomerDissatisfaction',
            text: 'Customer Dissatisfaction',
        }];


    public static Priority: IPriority[] = [
        {
            value: '1',
            caption: 'High',
            text: 'Priority High'
        },
        {
            value: '2',
            caption: 'Medium',
            text: 'Priority Medium',
        },
        {
            value: '3',
            caption: 'Low',
            text: 'Priority Low'
        }
    ];

    public static CompletionStatusType: ICompletionStatusType[] = [
        {
            value: '1',
            caption: 'Notified',
            text: 'Notified'
        },
        {
            value: '2',
            caption: 'Assigned',
            text: 'Assigned',
        },
        {
            value: '3',
            caption: 'Delegated',
            text: 'Delegated'
        },
        {
            value: '4',
            caption: 'Accepted',
            text: 'Accepted'
        },
        {
            value: '5',
            caption: 'ReferredTo',
            text: 'Referred To'
        },
        {
            value: '6',
            caption: 'Closed',
            text: 'Closed'
        }
    ];

    public static UploadDocuments: IUploadDocuments[] = [
        {
            value: '1',
            caption: 'ViewLessonsLearnt',
            text: 'Lessons Learnt'
        },
        {
            value: '2',
            caption: 'ViewAuditReport',
            text: 'Audit Report'
        }
    ];


    public static EmergencySituationEnum: IEmergencySituationEnum[] = [
        {
            EmergencySituationId: 1,
            enumtype: 'EmergencyInitiationtoHoD',
            EmergencySituationName: 'Emergency Initiation to HoD'
        },
        {
            EmergencySituationId: 2,
            enumtype: 'EmergencyInitiationtoTeamMember',
            EmergencySituationName: 'Emergency Initiation to Team Member'
        },
        {
            EmergencySituationId: 3,
            enumtype: 'RequestAssignedtoDepartmentSPOC',
            EmergencySituationName: 'Request Assigned to Department SPOC'
        },
        {
            EmergencySituationId: 7,
            enumtype: 'RequestCompletedToRequesterDepartmentSPOC',
            EmergencySituationName: 'Request Completed To Requester Department SPOC'
        },
        {
            EmergencySituationId: 4,
            enumtype: 'ChecklistCompletedToDepartmentSPOC',
            EmergencySituationName: 'Checklist Completed To Department SPOC'
        },
        {
            EmergencySituationId: 5,
            enumtype: 'ChecklistReopenedToDepartmentSPOC',
            EmergencySituationName: 'Checklist Reopened To DepartmentSPOC'
        },
        {
            EmergencySituationId: 6,
            enumtype: 'EmergencyClosureToTeamMember',
            EmergencySituationName: 'Emergency Closure to Team Member'
        }
        ,
        {
            EmergencySituationId: 8,
            enumtype: 'RequestApprovalToApproverDepartmentSPOC',
            EmergencySituationName: 'Request Approval To Approver Department SPOC'
        }
    ];

    public static InvolvedPartyType: object = [
        { value: 'Flight', key: 1 },
        { value: 'NonFlight', key: 2 }
    ];

    public static TargetDepartmentTravel: number = 3;
    public static TargetDepartmentAdmin: number = 4;
    public static TargetDepartmentCrew: number = 6;
    public static DemandTypeId: number = 1;
    public static RequiredLocation: string = 'Office';
    public static ScheduleTimeForCallback: number = 75;
    public static ScheduleTimeForTravel: number = 90;
    public static ScheduleTimeForAdmin: number = 60;
    public static ScheduleTimeForDemandForCrew: number = 70;
    public static RequesterTypeDemand: string = 'Demand';
    public static RequesterTypeEnquiry: string = 'Enquiry';
    public static InteractionDetailsTypeDemand: string = 'DemandType';
    public static InteractionDetailsTypeEnquiry: string = 'EnquiryType';

    public static MedicalStatus: IMedicalStatus[] = [
        {
            key: 1,
            value: 'Uninjured',
            caption: 'Uninjured'
        },
        {
            key: 2,
            value: 'Injured',
            caption: 'Injured'
        },
        {
            key: 3,
            value: 'Missing',
            caption: 'Missing'
        },
        {
            key: 4,
            value: 'Deceased',
            caption: 'Deceased'
        },
        {
            key: 5,
            value: 'Others',
            caption: 'Others'

        },
        {
            key: 6,
            value: 'UnidentifiedPDA',
            caption: 'Unidentified PDA'

        }
    ];

    public static ActionableStatus: IActionableStatus[] = [
        {
            key: 1,
            value: 'Notified',
            caption: 'Notified'
        },
        {
            key: 2,
            value: 'Assigned',
            caption: 'Assigned'
        },
        {
            key: 3,
            value: 'Delegated',
            caption: 'Delegated'
        },
        {
            key: 4,
            value: 'Accepted',
            caption: 'Accepted'
        },
        {
            key: 5,
            value: 'Refferedto',
            caption: 'Reffered To'
        },
        {
            key: 6,
            value: 'Closed',
            caption: 'Closed'
        },
    ];

    
    public static RequesterType: IRequesterType[] = [
        {
            value: '1',
            enumtype: 'PDA',
            caption: 'PDA'
        },
        {
            value: '2',
            enumtype: 'NOK',
            caption: 'NOK'
        },
        {
            value: '3',
            enumtype: 'Staff',
            caption: 'Staff'
        },
        {
            value: '4',
            enumtype: 'Others',
            caption: 'Others'
        }
    ];

    public static CargoStatus: IMedicalStatus[] = [
        {
            key: 1,
            value: 'Missing',
            caption: 'Missing'
        },
        {
            key: 2,
            value: 'Found',
            caption: 'Found'
        },
        {
            key: 3,
            value: 'Others',
            caption: 'Others'
        }
    ];

}

export enum DataModels {
    DEPARTMENT = 'departments' as any,
}

export const LayoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const WEBREQUEST = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

export const IMAGES_ROOT = 'assets/images/';

export const LayoutPaths = {
    images: {
        root: IMAGES_ROOT,
        profile: IMAGES_ROOT + 'app/profile/'
        // amMap: 'assets/img/theme/vendor/ammap/',
        // amChart: 'assets/img/theme/vendor/amcharts/dist/amcharts/images/'
    }
};

export const layoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const isMobile = () =>
    (/android|webos|iphone|ipad|ipod|blackberry|windows phone/)
        .test(navigator.userAgent.toLowerCase());
