import _ from "lodash";

export function toNumber(param: unknown): number {
    return Math.abs(_.toInteger(param));
}