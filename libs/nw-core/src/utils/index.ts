import _ from "lodash";

export const EMPTY_STRING = "";

export function toPositiveInteger(param: unknown, defaultValue: number): number {
    if(typeof param === 'number' || typeof param === 'string') {
        let intVal = Math.abs(_.toInteger(param));
        if(intVal !== 0) {
            return intVal;
        }
    }
    return defaultValue;
}

export function toBoolean(param: unknown, defaultValue: boolean): boolean {
    if(typeof param === 'boolean') {
        defaultValue = param;
    } else if(typeof param === 'string') {
        if(param.trim().toLowerCase() === 'true') {
            defaultValue = true;
        } 
        if(param.trim().toLowerCase() === 'false') {
            defaultValue = false;
        }
    }
    return defaultValue;
}