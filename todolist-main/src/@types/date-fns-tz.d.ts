declare module "date-fns-tz" {
  export type OptionsWithTZ = {
    timeZone?: string;
    locale?: unknown;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  };

  export function format(
    date: Date | number,
    format: string,
    options?: OptionsWithTZ,
  ): string;

  export function getTimezoneOffset(
    timeZone: string,
    date?: Date | number,
  ): number;

  export function utcToZonedTime(
    date: Date | string | number,
    timeZone: string,
    options?: OptionsWithTZ,
  ): Date;

  export function zonedTimeToUtc(
    date: Date | string | number,
    timeZone: string,
    options?: OptionsWithTZ,
  ): Date;
}
