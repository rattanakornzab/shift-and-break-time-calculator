import type { Employee, WorkStatus } from '@/types';

/** Convert "HH:MM" to minutes from midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Convert minutes from midnight to "HH:MM" (wraps past 24h). */
export function minutesToTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Compute end time = start + shiftHours + breakMinutes. */
export function computeEndTime(startTime: string, shiftHours: number, breakMinutes: number): string {
  const start = timeToMinutes(startTime);
  return minutesToTime(start + Math.round(shiftHours * 60) + breakMinutes);
}

/** Format hours with up to 1 decimal, trimming trailing .0 */
export function formatHours(h: number): string {
  return String(Number(h.toFixed(1)));
}

/**
 * Determine real-time work status by comparing current time against
 * start and end times. Handles overnight shifts (end < start).
 */
export function getStatus(emp: Employee, now: Date): WorkStatus {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(emp.startTime);
  const endMin = timeToMinutes(emp.endTime);

  const spansMidnight = endMin <= startMin;

  let active: boolean;
  if (spansMidnight) {
    active = nowMin >= startMin || nowMin < endMin;
  } else {
    active = nowMin >= startMin && nowMin < endMin;
  }

  if (active) return 'working';

  // Not active: either upcoming or off.
  if (spansMidnight) {
    // For overnight shifts, "upcoming" is between end and start.
    return nowMin >= endMin && nowMin < startMin ? 'upcoming' : 'off';
  }

  return nowMin < startMin ? 'upcoming' : 'off';
}

export const STATUS_LABEL: Record<WorkStatus, string> = {
  working: 'กำลังทำงาน',
  off: 'เลิกงานแล้ว',
  upcoming: 'ยังไม่ถึงเวลาเข้างาน',
};

export const STATUS_STYLES: Record<WorkStatus, string> = {
  working: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30',
  off: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-600/30',
  upcoming: 'bg-sky-100 text-sky-700 ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-500/30',
};

export const TYPE_LABEL: Record<Employee['type'], string> = {
  'full-time': 'พนักงานประจำ',
  'part-time': 'พนักงานพาร์ตไทม์',
};

export const DEFAULT_POSITIONS = ['หน้าร้าน', 'แคชเชียร์', 'คลังสินค้า', 'ไม่ระบุ'];
