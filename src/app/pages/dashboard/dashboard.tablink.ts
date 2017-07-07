import { ITabLinkInterface } from '../../shared';

export const TAB_LINKS: ITabLinkInterface[] = [
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
                selected: false,
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