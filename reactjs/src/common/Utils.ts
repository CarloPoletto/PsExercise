import moment from "moment";
import * as Types from "../common/Types";

/* Miscellaneous
-----------------------------------*/
export function sleep(ms: number): Promise<void> {
    if(ms > 0)
        return new Promise(resolve => setTimeout(resolve, ms));
}

export function getGUID(): string {
    let s4 = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

// Date
//-----------------------------
export const format0 = "DD/MM/YYYY";
export const format1 = "DD-MM-YYYY";
export const format2 = `YYYY-MM-DD`;
export const format3 = `YYYY/MM/DD`;

export function checkDateString(input: Types.DateValue): boolean {
    return getMoment(input).isValid();
}

export function stringToDate(value: Types.DateValue): Date {
    let moment = getMoment(value);
    return moment?.isValid() != true ? null : moment.toDate();
}

export function formatDateToScreen(input: Types.DateValue): string {
    return formatDate(input, format0);
}

export function formatDate(input: Types.DateValue, format: string): string {
    let moment = getMoment(input);
    return moment?.isValid() != true ? null : moment.format(format);
}

export function getMoment(input: Types.DateValue): moment.Moment {
    if(input instanceof Date) {
        return moment(input);
    }

    let formats = [
        format0,
        format1,
        format2,
        format3,
    ];

    for(let format of formats) {
        let value = moment(input, format, true);
        if (value.isValid()) {
            return value;
        }
    }

    return null;
}