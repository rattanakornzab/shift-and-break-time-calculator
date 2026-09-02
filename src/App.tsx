import { useState, useEffect, useCallback } from 'react';
import { CalendarClock, Sun, Moon } from 'lucide-react';
import type { Employee } from '@/types';
import EmployeeForm from '@/components/EmployeeForm';
import SummaryCards from '@/components/SummaryCards';
import EmployeeTable from '@/components/EmployeeTable';
import HelpGuide from '@/components/HelpGuide';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { theme, toggle } = useTheme();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [now, setNow] = useState(new Date());
  const [query, setQuery] = useState('');

  // Live clock — updates every 1 second so both the clock and status badges stay real-time.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleAdd = useCallback((emp: Employee) => {
    setEmployees((prev) => [...prev, emp]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const totalHours = employees.reduce((sum, e) => sum + e.shiftHours, 0);

  const clockText = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateText = now.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-sm">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                Shift &amp; Break Time Calculator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                คำนวณกะและเวลาพักพนักงาน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
              aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดกลางวัน' : 'เปลี่ยนเป็นโหมดกลางคืน'}
              title={theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Live clock */}
            <div className="flex flex-col items-start rounded-xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200 transition-colors duration-300 dark:bg-slate-800 dark:ring-slate-700 sm:items-end">
              <span className="font-mono text-lg font-semibold tabular-nums text-blue-700 dark:text-blue-400">
                {clockText}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {dateText}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <HelpGuide />

        <SummaryCards
          totalEmployees={employees.length}
          totalHours={totalHours}
        />

        <EmployeeForm
          existingNames={employees.map((e) => e.name)}
          onAdd={handleAdd}
        />

        <EmployeeTable
          employees={employees}
          now={now}
          query={query}
          onQueryChange={setQuery}
          onRemove={handleRemove}
        />

        <p className="pb-6 text-center text-xs text-slate-400 dark:text-slate-500">
          ข้อมูลทั้งหมดเก็บในหน่วยความจำเบราว์เซอร์ ·
          รีเฟรชหน้าจะล้างข้อมูลทั้งหมด
        </p>
      </main>
    </div>
  );
}

export default App;
