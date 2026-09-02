import { useState, type FormEvent } from 'react';
import { User, Calculator, AlertCircle } from 'lucide-react';
import type { Employee, EmployeeType } from '@/types';
import { computeEndTime, DEFAULT_POSITIONS } from '@/utils/shift';

interface Props {
  existingNames: string[];
  onAdd: (emp: Employee) => void;
}

const PRESET_POSITIONS = [...DEFAULT_POSITIONS];

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20';

const labelClass =
  'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function EmployeeForm({ existingNames, onAdd }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<EmployeeType>('full-time');
  const [position, setPosition] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [shiftHours, setShiftHours] = useState('8');
  const [breakMinutes, setBreakMinutes] = useState('60');
  const [error, setError] = useState('');

  function reset() {
    setName('');
    setType('full-time');
    setPosition('');
    setStartTime('09:00');
    setShiftHours('8');
    setBreakMinutes('60');
    setError('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('กรุณากรอกชื่อพนักงาน');
      return;
    }
    const lower = trimmedName.toLowerCase();
    if (existingNames.some((n) => n.toLowerCase() === lower)) {
      setError('ชื่อพนักงานนี้มีในระบบแล้ว');
      return;
    }

    const shift = parseFloat(shiftHours);
    if (isNaN(shift) || shift < 0.5 || shift > 24) {
      setError('ชั่วโมงกะงานต้องอยู่ระหว่าง 0.5 ถึง 24 ชั่วโมง');
      return;
    }

    const breakMin = parseInt(breakMinutes, 10);
    if (isNaN(breakMin) || breakMin < 0) {
      setError('กรุณากรอกเวลาพัก (นาที) ให้ถูกต้อง');
      return;
    }

    const totalWorkMinutes = Math.round(shift * 60);
    if (breakMin >= totalWorkMinutes) {
      setError('เวลาพักต้องน้อยกว่าเวลาทำงานทั้งหมด');
      return;
    }

    const trimmedPosition = position.trim() || 'ไม่ระบุ';
    const endTime = computeEndTime(startTime, shift, breakMin);

    onAdd({
      id: crypto.randomUUID(),
      name: trimmedName,
      type,
      position: trimmedPosition,
      startTime,
      shiftHours: shift,
      breakMinutes: breakMin,
      endTime,
    });
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800 sm:p-6"
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        เพิ่มข้อมูลพนักงาน
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className={labelClass}>ชื่อพนักงาน</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น สมชาย ใจดี"
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>ประเภทพนักงาน</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EmployeeType)}
            className={inputClass}
          >
            <option value="full-time">พนักงานประจำ</option>
            <option value="part-time">พนักงานพาร์ตไทม์</option>
          </select>
        </div>

        {/* Position - combobox style */}
        <div>
          <label className={labelClass}>ตำแหน่ง / แผนก</label>
          <input
            type="text"
            list="position-options"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="เลือกหรือพิมพ์ตำแหน่ง"
            className={inputClass}
          />
          <datalist id="position-options">
            {PRESET_POSITIONS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        {/* Start time */}
        <div>
          <label className={labelClass}>เวลาเข้างาน</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Shift hours */}
        <div>
          <label className={labelClass}>ชั่วโมงกะงาน (0.5 - 24)</label>
          <input
            type="number"
            min={0.5}
            max={24}
            step={0.5}
            value={shiftHours}
            onChange={(e) => setShiftHours(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Break minutes */}
        <div className="sm:col-span-2">
          <label className={labelClass}>เวลาพัก (นาที)</label>
          <input
            type="number"
            min={0}
            step={1}
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto"
      >
        <Calculator className="h-4 w-4" />
        คำนวณและบันทึก
      </button>
    </form>
  );
}
