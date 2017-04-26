
export class GlobalConstants {
    public static EXTERNAL_URL: string = 'http://localhost:5001/';
    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch'
    public static ACCESS_TOKEN: string = 'access_token';
    public static EmergencyCategories: Object = [
        { value: "FlightRelated", key: 1 },
        { value: "NonFlightRelated", key: 2 }
    ];
    public static ActiveFlag: Object = [{ value: "Active", key: 0 }, { value: "InActive", key: 1 }];
    public static TemplateMediaType: any[] = [
        { value: "Sms", key: 1 },
        { value: "PushNotification", key: 2 },
        { value: "Email", key: 3 },
        { value: "Pdf", key: 4 }
    ];
    public static EnquiryType: Object = [
        {
            value: "1",
            caption: "Passenger",
            text: "Passenger related"
        },
        {
            value: "2",
            caption: "Cargo",
            text: "Cargo related"
        },
        {
            value: "3",
            caption: 'Media',
            text: "Media related",
        },
        {
            value: "4",
            caption: 'Others',
            text: "Others",
        },
        {
            value: "5",
            caption: 'Crew',
            text: "Crew",
        }];
    public static Priority: any[] = [
        {
            value: "1",
            caption: "High",
            text: "Priority High"
        },
        {
            value: "2",
            caption: 'Medium',
            text: "Priority Medium",
        },
        {
            value: "3",
            caption: "Low",
            text: "Priority Low"
        }
    ];
    public static EmergencySituationEnum: any[] = [
        {
            EmergencySituationId: "1",
            enumtype: 'EmergencyInitiationtoHoD',
            EmergencySituationName: 'Emergency Initiation to HoD'
        },
        {
            EmergencySituationId: "2",
            enumtype: 'EmergencyInitiationtoTeamMember',
            EmergencySituationName: 'Emergency Initiation to Team Member'
        },
        {
            EmergencySituationId: "3",
            enumtype: 'RequestAssignedtoDepartmentSPOC',
            EmergencySituationName: 'Request Assigned to Department SPOC'
        },
        {
            EmergencySituationId: "7",
            enumtype: 'RequestCompletedToRequesterDepartmentSPOC',
            EmergencySituationName: 'Request Completed To Requester Department SPOC'
        },
        {
            EmergencySituationId: "4",
            enumtype: 'ChecklistCompletedToDepartmentSPOC',
            EmergencySituationName: 'Checklist Completed To Department SPOC'
        },
        {
            EmergencySituationId: "5",
            enumtype: 'ChecklistReopenedToDepartmentSPOC',
            EmergencySituationName: 'Checklist Reopened To DepartmentSPOC'
        },
        {
            EmergencySituationId: "6",
            enumtype: 'EmergencyClosureToTeamMember',
            EmergencySituationName: 'Emergency Closure to Team Member'
        }
        ,
        {
            EmergencySituationId: "8",
            enumtype: 'RequestApprovalToApproverDepartmentSPOC',
            EmergencySituationName: 'Request Approval To Approver Department SPOC'
        }
    ];
    public static InvolvedPartyType: Object = [
        { value: "Flight", key: 1 },
        { value: "NonFlight", key: 2 }
    ];
    public static TargetDepartmentTravel: number = 3;
    public static TargetDepartmentAdmin: number = 4;
    public static TargetDepartmentCrew: number = 6;
    public static DemandTypeId: number = 1;
    public static RequiredLocation: string = "Office";
    public static ScheduleTimeForCallback: number = 75;
    public static ScheduleTimeForTravel: number = 90;
    public static ScheduleTimeForAdmin: number = 60;
    public static ScheduleTimeForDemandForCrew: number = 70;
    public static RequesterTypeDemand: string = "Demand";
    public static RequesterTypeEnquiry: string = "Enquiry";
    public static InteractionDetailsTypeDemand: string = "DemandType";
    public static InteractionDetailsTypeEnquiry: string = "EnquiryType";
    public static MedicalStatus: any[] = [
        {
            key: 1,
            value: 'Injury',
            caption: 'Minor Injury'
        },
        {
            key: 2,
            value: 'Critical',
            caption: 'Critical'
        },
        {
            key: 3,
            value: 'Reunited',
            caption: 'Reunited'
        },
        {
            key: 4,
            value: 'Deceased',
            caption: 'Deceased'
        }
    ];
    public static RequesterType: any[] = [
        {
            value: "1",
            enumtype: 'PDA',
            caption: 'PDA'
        },
        {
            value: "2",
            enumtype: 'NOK',
            caption: 'NOK'
        },
        {
            value: "3",
            enumtype: 'Staff',
            caption: 'Staff'
        },
        {
            value: "4",
            enumtype: 'Others',
            caption: 'Others'
        }
    ];



}

export enum DataModels {
    DEPARTMENT = <any>'departments',
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
}

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
