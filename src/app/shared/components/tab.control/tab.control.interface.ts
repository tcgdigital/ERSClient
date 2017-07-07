
export interface ITabLinkInterface {
    id: string;
    title: string;
    url: string;
    icon: string;
    selected: boolean;
    hidden: boolean;
    order: number;
    subtab: ITabLinkInterface[];
}