import { DateTime } from 'luxon';
const timezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export function formatTimeFromIso(
  value?: string | Date | number,
  tz: string = timezone
): string {
  if (!value) return '';

  return DateTime.fromJSDate(value instanceof Date ? value : new Date(value), {
    zone: 'utc',
  })
    .setZone(tz)
    .toFormat('HH:mm');
}

export function formatDateTimeFromIso(
  value?: string | Date | number,
  tz: string = timezone
): string {
  if (!value) return '';

  return DateTime.fromJSDate(value instanceof Date ? value : new Date(value), {
    zone: 'utc',
  })
    .setZone(tz)
    .setLocale('vi-VN')
    .toLocaleString(DateTime.DATETIME_MED);
}

export const calculateAge = (birth?: string | null): number | null => {
  if (!birth) return null;
  const bd = new Date(birth);
  if (isNaN(bd.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
  return age;
};

export function hhmmToMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(':').map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

export function convertlocalToISO(
  localDateTime: string | Date | number,
  tz: string = timezone
): string | null {
  const isoString =
    typeof localDateTime === 'string'
      ? localDateTime
      : DateTime.fromJSDate(new Date(localDateTime)).toISO();

  if (!isoString) return null;

  return DateTime.fromISO(isoString, { zone: tz }).toUTC().toISO();
}

export function startOfDayISO(
  date: Date,
  tz: string = timezone
): string | null {
  return DateTime.fromJSDate(date, { zone: tz }).startOf('day').toUTC().toISO();
}

export function endOfDayISO(date: Date, tz: string = timezone): string | null {
  return DateTime.fromJSDate(date, { zone: tz }).endOf('day').toUTC().toISO();
}
