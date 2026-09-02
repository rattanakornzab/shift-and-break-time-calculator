import { useMemo } from 'react';
import { Search, Trash2, Inbox } from 'lucide-react';
import type { Employee, WorkStatus } from '@/types';
import {
  getStatus,
  STATUS_LABEL,
  STATUS_STYLES,
  TYPE_LABEL,
} from '@/utils/shift';

interface Props {
  employees: Employee[];
  now: Date;
  query: string;
  onQueryChange: (q: string) => void;
  onRemove: (id: string) => void;
}

export default function EmployeeTable({
  employees,
  now,
  query,
  onQueryChange,
  onRemove,
}: Props) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }, [employees, query]);

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800">
      {/* Header with search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          รายชื่อพนักงาน
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาชื่อหรือตำแหน่ง..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          />
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="px-5 py-3">ชื่อ</th>
              <th className="px-5 py-3">ประเภท</th>
              <th className="px-5 py-3">ตำแหน่ง</th>
              <th className="px-5 py-3">เข้างาน</th>
              <th className="px-5 py-3">พัก</th>
              <th className="px-5 py-3">เลิกงาน</th>
              <th className="px-5 py-3">สถานะ</th>
              <th className="px-5 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12">
                  <EmptyState hasQuery={!!query.trim()} />
                </td>
              </tr>
            ) : (
              filtered.map((emp) => {
                const status = getStatus(emp, now);
                return (
                  <tr
                    key={emp.id}
                    className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {emp.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {TYPE_LABEL[emp.type]}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {emp.position}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {emp.startTime}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                      {emp.breakMinutes} นาที
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {emp.endTime}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => onRemove(emp.id)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        aria-label={`ลบ ${emp.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState hasQuery={!!query.trim()} />
          </div>
        ) : (
          filtered.map((emp) => {
            const status = getStatus(emp, now);
            return (
              <div key={emp.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                      {emp.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {TYPE_LABEL[emp.type]} · {emp.position}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(emp.id)}
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    aria-label={`ลบ ${emp.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-800">
                    <p className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">
                      เข้า
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {emp.startTime}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-800">
                    <p className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">
                      พัก
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {emp.breakMinutes}น.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-800">
                    <p className="text-[10px] font-medium uppercase text-slate-400 dark:text-slate-500">
                      เลิก
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {emp.endTime}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: WorkStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        {hasQuery ? 'ไม่พบพนักงานที่ค้นหา' : 'ยังไม่มีพนักงานในระบบ'}
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {hasQuery
          ? 'ลองเปลี่ยนคำค้นหา'
          : 'กรอกข้อมูลด้านบนแล้วกดคำนวณและบันทึก'}
      </p>
    </div>
  );
}
