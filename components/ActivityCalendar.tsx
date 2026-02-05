
import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';

interface ActivityCalendarProps {
  logs: string[]; // dates of logs
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ logs }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 flex items-center">
          <CalendarIcon size={18} className="mr-2 text-orange-300" />
          健康カレンダー
        </h3>
        <div className="flex items-center space-x-2 text-gray-400">
          <span className="text-sm font-medium">{year}年 {monthNames[month]}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map(d => (
          <div key={d} className="text-[10px] text-gray-400 font-bold">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`b-${b}`} />)}
        {days.map(d => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const hasLog = logs.includes(dateStr);
          const isToday = d === today.getDate();

          return (
            <div
              key={d}
              className={`h-8 flex flex-col items-center justify-center relative rounded-lg ${isToday ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600'
                }`}
            >
              <span className="text-xs">{d}</span>
              {hasLog && (
                <div className="absolute bottom-1 w-1 h-1 bg-teal-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
