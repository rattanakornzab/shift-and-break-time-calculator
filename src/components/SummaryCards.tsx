import { Users, Clock } from 'lucide-react';
import { formatHours } from '@/utils/shift';

interface Props {
  totalEmployees: number;
  totalHours: number;
}

export default function SummaryCards({ totalEmployees, totalHours }: Props) {
  const cards = [
    {
      label: 'พนักงานทั้งหมด',
      value: totalEmployees.toString(),
      unit: 'คน',
      icon: Users,
      accent: 'from-blue-500 to-blue-600',
      ring: 'ring-blue-100 dark:ring-blue-900/40',
    },
    {
      label: 'รวมชั่วโมงกะงาน',
      value: formatHours(totalHours),
      unit: 'ชม.',
      icon: Clock,
      accent: 'from-sky-500 to-sky-600',
      ring: 'ring-sky-100 dark:ring-sky-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 transition-colors duration-300 dark:bg-slate-900 ${c.ring} sm:p-5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  {c.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
                  {c.value}
                  <span className="ml-1 text-sm font-medium text-slate-400 dark:text-slate-500 sm:text-base">
                    {c.unit}
                  </span>
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow-sm sm:h-12 sm:w-12`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
