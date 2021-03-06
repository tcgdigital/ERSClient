export class DateTimePickerOptions {
    classes?: string;
    inline?: string;
    language?: string;
    startDate?: Date;
    firstDay?: number;
    weekends?: number[];
    dateFormat?: string;
    altField?: string;
    altFieldDateFormat?: string;
    toggleSelected?: boolean;
    keyboardNav?: boolean;
    position?: string;
    offset?: number;
    view?: string;
    minView?: string;
    showOtherMonths?: boolean;
    selectOtherMonths?: boolean;
    moveToOtherMonthsOnSelect?: boolean;
    showOtherYears?: boolean;
    selectOtherYears?: boolean;
    moveToOtherYearsOnSelect?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disableNavWhenOutOfRange?: boolean;
    multipleDates?: boolean;
    multipleDatesSeparator?: string;
    range?: boolean;
    todayButton?: boolean;
    clearButton?: boolean;
    showEvent?: string;
    autoClose?: boolean;
    prevHtml?: string;
    nextHtml?: string;
    navTitles?: INavTitle;
    monthsField?: string;
    timepicker?: boolean;
    dateTimeSeparator?: string;
    timeFormat?: string;
    minHours?: number;
    maxHours?: number;
    minMinutes?: number;
    maxMinutes?: number;
    hoursStep?: number;
    minutesStep?: number;

    onSelect: (formattedDate: string, date: Date | Date[], inst: object) => void;
    onShow: (inst: object, animationCompleted: boolean) => void;
    onHide: (inst: object, animationCompleted: boolean) => void;
    onChangeMonth: (month: number, year: number) => void;
    onChangeYear: (year: number) => void;
    onChangeView: (view: string) => void;
    onRenderCell: (date: Date, cellType: string) => void;

    /**
     * Creates an instance of DateTimePickerOptions.
     *
     * @memberOf DateTimePickerOptions
     */
    constructor(maxDate?: Date) {
        this.language = 'en';
        this.dateFormat = 'DD-MMM-YYYY';
        // if (maxDate != undefined) {
        //     this.maxDate = maxDate;
        // }
        this.todayButton = true;
        this.clearButton = true;
        this.autoClose = true;
        this.timepicker = true;
        this.timeFormat = 'hh:ii AA';
    }
}

export class DateTimePickerSelectEventArgs {
    FormattedDate: string;
    SelectedDate: Date | Date[];
}



export class DateTimePickerChangeMonthEventArgs {
    Month: number;
    Year: number;
}

export class DateTimePickerRenderCellEventArgs {
    CellDate: Date;
    CellType: string;
}

export interface INavTitle {
    days: string;
    months: string;
    years: string;
}

