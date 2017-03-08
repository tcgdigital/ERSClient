import { IMenuItem } from '../shared/components/sidemenu';

export const PAGES_MENU: IMenuItem[] = <IMenuItem[]>[
    // export const PAGES_MENU = [
    {
        path: 'pages',
        children: [
            {
                path: 'dashboard',
                data: {
                    menu: {
                        title: 'Dashboard',
                        icon: 'fa fa-home fa-lg',
                        selected: true,
                        expanded: false,
                        order: 0
                    }
                },
                children: [
                    {
                        path: 'affectedPeople',
                        data: {
                            menu: {
                                title: 'AffectedPeople',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'affectedObjects',
                        data: {
                            menu: {
                                title: 'AffectedObjects',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'actionable',
                        data: {
                            menu: {
                                title: 'Actionable',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'callCentre',
                        data: {
                            menu: {
                                title: 'callCentre',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    }]
            },
            {
                path: 'masterdata',
                data: {
                    menu: {
                        title: 'Master Data',
                        icon: 'fa fa-home fa-lg',
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                },
                children: [
                    {
                        path: 'department',
                        data: {
                            menu: {
                                title: 'Department',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'checklist',
                        data: {
                            menu: {
                                title: 'Checklist',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'demandtype',
                        data: {
                            menu: {
                                title: 'Demand Type',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'emergencytype',
                        data: {
                            menu: {
                                title: 'Emergenct Type',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'quicklink',
                        data: {
                            menu: {
                                title: 'Quick Link',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'emergencydepartment',
                        data: {
                            menu: {
                                title: 'Emergency Department',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'userpermission',
                        data: {
                            menu: {
                                title: 'User Permission',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'departmentfunctionality',
                        data: {
                            menu: {
                                title: 'Department Functionality',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'userprofile',
                        data: {
                            menu: {
                                title: 'User Profile',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    }
                ]
            },
            {
                path: 'incident',
                data: {
                    menu: {
                        title: 'Incident',
                        icon: 'fa fa-home fa-lg',
                        selected: false,
                        expanded: false,
                    }
                }
            }
        ]
    }
];