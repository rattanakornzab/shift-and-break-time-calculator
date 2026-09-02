export type EmployeeType = 'full-time' | 'part-time';

export interface Employee {
  id: string;
  name: string;
  type: EmployeeType;
  position: string;
  startTime: string; // "HH:MM"
  shiftHours: number; // 0.5 - 24
  breakMinutes: number; // minutes
  endTime: string; // computed "HH:MM"
}

export type WorkStatus = 'working' | 'off' | 'upcoming';
