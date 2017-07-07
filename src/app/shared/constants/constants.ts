import { ITabLinkInterface } from '../components/tab.control/tab.control.interface';
declare const CKEDITOR;

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
    // public static EXTERNAL_URL: string = 'http://202.54.73.219/';
    public static EXTERNAL_URL: string = 'http://172.20.23.110:84/';
    // public static EXTERNAL_URL: string = 'http://localhost:5001/';

    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch';
    public static ACCESS_TOKEN: string = 'access_token';
    public static AD_AUTH_ENABLED: boolean = false;
    public static PASSWORD_PATTERN: RegExp = /^(?!.*[\s])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/ig;
    public static NUMBER_PATTERN: string = '^[0-9-+]*$';
    public static EMAIL_PATTERN: string = '^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$';
    public static URL_PATTERN: string = '^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\~\+#]*[\w\-\@?^=%&amp;\~\+#])?$';
    public static LAST_INCIDENT_PICK_COUNT: string = '5';
    public static ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION: number = 12;

    public static INTERCEPTOR_PERFORM: boolean = false;
    public static PRESERVE_DATA_FROM_CONVERSION = ['EmergencyDate'];

    public static EditorToolbarConfig: any = {
        // uiColor: '#99000',
        enterMode: CKEDITOR.ENTER_BR,
        allowedContent: true,
        extraAllowedContent: 'br',
        toolbar: [
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
            { name: 'links', items: ['Link', 'Unlink'] },
            { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar'] },
            { name: 'tools', items: ['Maximize'] },
            '/',
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
            { name: 'styles', items: ['Styles', 'Format'] },
        ]
    };

    public static LicenseValidationCode: IKeyValue[] = [
        { key: 101, value: 'License is valid.' },
        { key: 102, value: 'License info file not found. Please contact the Administrator.' },
        { key: 103, value: 'License info file is invalid or corrupted. Please contact the Administrator.' },
        { key: 104, value: 'Current machine is not registered with the license. Please contact the Administrator.' },
        { key: 105, value: 'License key is invalid or not provided. Please enter your license key or contact the Administrator.' },
        { key: 106, value: 'License has expired. To renew the license please contact the Administrator.' }
    ];

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
            text: 'High'
        },
        {
            value: '2',
            caption: 'Medium',
            text: 'Medium',
        },
        {
            value: '3',
            caption: 'Low',
            text: 'Low'
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

    public static TargetDepartmentTravel: number = 10;
    public static TargetDepartmentAdmin: number = 13;
    public static TargetDepartmentCrew: number = 9;
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

    public static TabLinks: ITabLinkInterface[] = [
        {
            id: 'Actionables',
            title: 'Checklists',
            // icon: 'fa fa-edge fa-2x',
            url: '/pages/dashboard/actionable',
            selected: false,
            hidden: false,
            order: 1,
            subtab: [
                {
                    id: 'ActivaChecklist',
                    title: 'Open Checklist',
                    url: './open',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'ClosedChecklist',
                    title: 'Close Checklist',
                    url: './close',
                    selected: false,
                    hidden: false,
                    order: 1
                }
            ]
        }, {
            id: 'Demand',
            title: 'Demand',
            // icon: 'fa fa-linux fa-2x',
            url: '/pages/dashboard/demand',
            selected: false,
            hidden: false,
            order: 2,
            subtab: [
                {
                    id: 'AssignedDemand',
                    title: 'Assigned To Me',
                    url: './assigned',
                    selected: true,
                    hidden: false,
                    order: 1
                }, {
                    id: 'OwnDemand',
                    title: 'My Demands',
                    url: './own',
                    selected: false,
                    hidden: false,
                    order: 2
                }, {
                    id: 'PendingDemand',
                    title: 'Approval Pending',
                    url: './approval',
                    selected: false,
                    hidden: false,
                    order: 3
                }, {
                    id: 'CompletedDemand',
                    title: 'Completed',
                    url: './completed',
                    selected: false,
                    hidden: false,
                    order: 4
                }
            ]
        }, {
            id: 'AffectedPeople',
            title: 'Affected People',
            // icon: 'fa fa-apple fa-2x',
            url: '/pages/dashboard/people',
            selected: true,
            hidden: false,
            order: 3,
            subtab: [
                {
                    id: 'AffectedPeople',
                    title: 'Affected People',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyAffectedPeople',
                    title: 'Verify Affected People',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'AffectedObjects',
            title: 'Affected Cargo',
            // icon: 'fa fa-chrome fa-2x',
            url: '/pages/dashboard/cargo',
            selected: false,
            hidden: false,
            order: 4,
            subtab: [
                {
                    id: 'Cargo',
                    title: 'Cargo',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyCargo',
                    title: 'Verify Cargo',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'BroadcastMessages',
            title: 'Broadcast Messages',
            // icon: 'fa fa-envira fa-2x',
            url: '/pages/dashboard/broadcast',
            selected: false,
            hidden: false,
            order: 5
        }, {
            id: 'PresidentMessages',
            title: 'President Messages',
            // icon: 'fa fa-firefox fa-2x',
            url: '/pages/dashboard/presidentMessage',
            selected: false,
            hidden: false,
            order: 6,
            subtab: [
                {
                    id: 'PresidentMessageRelease',
                    title: 'President Message Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'PresidentMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaManagement',
            title: 'Media Messages',
            // icon: 'fa fa-medium fa-2x',
            url: '/pages/dashboard/media',
            selected: false,
            hidden: false,
            order: 7,
            subtab: [
                {
                    id: 'MediaMessageRelease',
                    title: 'Media Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'MediaMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'OtherQuery',
            title: 'Other Query',
            // icon: 'fa fa-windows fa-2x',
            url: '/pages/dashboard/otherQuery',
            selected: false,
            hidden: false,
            order: 9,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CrewQuery',
            title: 'Crew Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/crewQuery',
            selected: false,
            hidden: false,
            order: 9,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'PassengerQuery',
            title: 'Passenger Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/passengerquery',
            selected: false,
            hidden: false,
            order: 10,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CargoQuery',
            title: 'Cargo Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/cargoquery',
            selected: false,
            hidden: false,
            order: 11,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaQuery',
            title: 'Media Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/mediaquery',
            selected: false,
            hidden: false,
            order: 12,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'FutureTravelQuery',
            title: 'Future Travel Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/futuretravelquery',
            selected: false,
            hidden: false,
            order: 13,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GeneralUpdateQuery',
            title: 'General Update Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/generalupdatequery',
            selected: false,
            hidden: false,
            order: 14,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'SituationalUpdatesQuery',
            title: 'Situational Updates Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/situationalupdatesquery',
            selected: false,
            hidden: false,
            order: 15,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CustomerDissatisfactionQuery',
            title: 'Customer Dissatisfaction Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/dashboard/customerdissatisfactionquery',
            selected: false,
            hidden: false,
            order: 16,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }
    ] as ITabLinkInterface[];
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
