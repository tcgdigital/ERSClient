import { IMenuItem } from '../shared/components/sidemenu';

export const PAGES_MENU: IMenuItem[] = [
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
                        order: 1
                    }
                }
            },
            {
                path: 'masterdata',
                data: {
                    menu: {
                        title: 'Master Data',
                        icon: 'fa fa-database fa-lg',
                        selected: false,
                        expanded: false,
                        order: 2
                    }
                }
            },
            {
                path: 'incident',
                data: {
                    menu: {
                        title: 'Incident',
                        icon: 'fa fa-bell fa-lg',
                        // icon: 'cmsicon-initiate-emergency cmsicon-5x',
                        selected: false,
                        expanded: false,
                        order: 3
                    }
                }
            },
            {
                path: 'uploaddata',
                data: {
                    menu: {
                        title: 'Upload',
                        icon: 'fa fa-cloud-upload fa-lg',
                        // icon: 'cmsicon-master-data-upload cmsicon-5x',
                        selected: false,
                        expanded: false,
                        order: 4
                    }
                }
            },
            {
                path: 'notifypeople',
                data: {
                    menu: {
                        title: 'Notify People',
                        icon: 'fa fa-paper-plane fa-lg',
                        selected: false,
                        expanded: false,
                        order: 5
                    }
                }

            },
            {
                path: 'callcenteronlypage',
                data: {
                    menu: {
                        title: 'Call center ',
                        icon: 'fa fa-phone fa-lg',
                        selected: false,
                        expanded: false,
                        order: 6
                    }
                }

            },
            {
                path: 'membertrack',
                data: {
                    menu: {
                        title: 'Member Tracking',
                        icon: 'fa fa-group fa-lg',
                        selected: false,
                        expanded: false,
                        order: 7
                    }
                }

            },
            {
                path: 'quickviewquicklink',
                data: {
                    menu: {
                        title: 'Quick Link',
                        icon: 'fa fa-link fa-lg',
                        selected: false,
                        expanded: false,
                        order: 8,
                        command: 'quicklink'
                    }
                }

            },
            {
                path: 'departmentclosure',
                data: {
                    menu: {
                        title: 'Dept Closure',
                        icon: 'fa fa-id-badge fa-lg',
                        selected: false,
                        expanded: false,
                        order: 9
                    }
                }
            },
            {
                path: 'emergencyclosure',
                data: {
                    menu: {
                        title: 'Close Crisis',
                        icon: 'fa fa-bell-slash fa-lg',
                        // icon: 'cmsicon-close-emergency cmsicon-6x',
                        selected: false,
                        expanded: false,
                        order: 10
                    }
                }
            },
            {
                path: 'archivelist',
                data: {
                    menu: {
                        title: 'Archive ',
                        icon: 'fa fa-archive fa-lg',
                        selected: false,
                        expanded: false,
                        order: 11
                    }
                }

            }
        ]
    }
] as IMenuItem[];


/*export const PAGES_MENU: IMenuItem[] = <IMenuItem[]>[
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
                        path: 'people',
                        data: {
                            menu: {
                                title: 'Affected People',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        },
                        children: [
                            {
                                path: 'detail',
                                data: {
                                    menu: {
                                        title: 'Detail',
                                        icon: 'fa fa-home fa-lg',
                                        selected: false,
                                        expanded: false,
                                    }
                                }
                            },
                            {
                                path: 'verify',
                                data: {
                                    menu: {
                                        title: 'Verified',
                                        icon: 'fa fa-home fa-lg',
                                        selected: false,
                                        expanded: false,
                                    }
                                }
                            },
                        ]
                    },
                    {
                        path: 'cargo',
                        data: {
                            menu: {
                                title: 'Cargo',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        },
                        children: [
                            {
                                path: 'detail',
                                data: {
                                    menu: {
                                        title: 'Detail',
                                        icon: 'fa fa-home fa-lg',
                                        selected: false,
                                        expanded: false,
                                    }
                                }
                            },
                            {
                                path: 'verify',
                                data: {
                                    menu: {
                                        title: 'Verified',
                                        icon: 'fa fa-home fa-lg',
                                        selected: false,
                                        expanded: false,
                                    }
                                }
                            },
                        ]
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
                        path: 'template',
                        data: {
                            menu: {
                                title: 'Notification Template',
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
            },

            {
                path: 'masterdataupload',
                data: {
                    menu: {
                        title: 'Master Data Upload',
                        icon: 'fa fa-home fa-lg',
                        selected: false,
                        expanded: false,
                    }
                }
            }
        ]
    }
];*/