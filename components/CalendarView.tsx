
import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '../types';
import { ChevronLeft, ChevronRight, Plus, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const range = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      range.push(i);
    }
    return range;
  }, []);

  const monthData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    const days = [];
    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month padding
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [viewDate]);

  const handleAddNewEvent = (preselectedDate?: string) => {
    const title = prompt('Event Title:');
    if (!title) return;

    const date = prompt('Date (YYYY-MM-DD):', preselectedDate || new Date().toISOString().split('T')[0]);
    if (!date) return;

    const typeOptions = ['work', 'personal', 'important'];
    const typeInput = prompt('Type (work, personal, important):', 'personal');
    const type = typeOptions.includes(typeInput || '') ? (typeInput as any) : 'personal';

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      date,
      type,
      description: ''
    };

    onAddEvent(newEvent);
  };

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  };

  const getHolidayInfo = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const key = `${y}-${m}-${day}`;

    // Simplified Holiday mapping for 2024/2025
    const holidays: Record<string, { label: string; isHoliday: boolean }> = {
      '2024-1-1': { label: '元旦', isHoliday: true },
      '2024-2-10': { label: '春节', isHoliday: true },
      '2024-2-11': { label: '春节', isHoliday: true },
      '2024-2-12': { label: '春节', isHoliday: true },
      '2024-4-4': { label: '清明', isHoliday: true },
      '2024-5-1': { label: '劳动节', isHoliday: true },
      '2024-6-10': { label: '端午', isHoliday: true },
      '2024-9-17': { label: '中秋', isHoliday: true },
      '2024-10-1': { label: '国庆节', isHoliday: true },
      '2024-10-2': { label: '国庆节', isHoliday: true },
      '2024-10-3': { label: '国庆节', isHoliday: true },
      '2025-1-1': { label: '元旦', isHoliday: true },
      '2025-1-29': { label: '春节', isHoliday: true },
    };

    return holidays[key];
  };

  const handlePrev = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNext = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const handleToday = () => setViewDate(new Date());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
            <select 
              value={viewDate.getMonth()} 
              onChange={handleMonthChange}
              className="text-2xl font-extrabold text-gray-900 bg-transparent hover:bg-gray-200/50 px-2 py-1 rounded-lg cursor-pointer outline-none transition-colors appearance-none"
            >
              {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
            </select>
            <select 
              value={viewDate.getFullYear()} 
              onChange={handleYearChange}
              className="text-2xl font-light text-gray-500 bg-transparent hover:bg-gray-200/50 px-2 py-1 rounded-lg cursor-pointer outline-none transition-colors appearance-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 ml-4">
            <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
            <button onClick={handleToday} className="px-3 py-1 text-sm font-semibold hover:bg-gray-100 rounded-md transition-colors border-x border-gray-100 text-gray-700">Today</button>
            <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">China Region (CN)</span>
          </div>
          <button 
            onClick={() => handleAddNewEvent()}
            className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-gray-100">
        <div className="py-3 text-center text-[10px] font-bold text-gray-300 border-r border-gray-50 uppercase tracking-tighter flex items-center justify-center">Week</div>
        {weekDays.map((day, idx) => (
          <div key={day} className={`py-3 text-center text-[11px] font-bold tracking-widest ${idx === 0 || idx === 6 ? 'text-red-400' : 'text-gray-400'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-[50px_repeat(7,1fr)] grid-rows-6 auto-rows-fr bg-gray-100 gap-px overflow-y-auto">
        {monthData.map((item, idx) => {
          const lunar = Lunar.fromDate(item.date);
          const isToday = item.date.toDateString() === new Date().toDateString();
          const holidayInfo = getHolidayInfo(item.date);
          const isWeekend = item.date.getDay() === 0 || item.date.getDay() === 6;
          
          const weekNumDisplay = idx % 7 === 0 ? (
            <div className="bg-gray-50/80 flex flex-col items-center justify-center text-gray-300 font-bold text-xs border-r border-gray-100">
              {getWeekNumber(item.date)}
            </div>
          ) : null;

          const lunarText = lunar.getFestivals()[0] || lunar.getJieQi() || (lunar.getDay() === 1 ? lunar.getMonthInChinese() + '月' : lunar.getDayInChinese());
          const isFestival = lunar.getFestivals().length > 0;

          const dateStr = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, '0')}-${item.date.getDate().toString().padStart(2, '0')}`;
          const dayEvents = events.filter(e => e.date === dateStr);

          return (
            <React.Fragment key={idx}>
              {weekNumDisplay}
              <div 
                onClick={() => handleAddNewEvent(dateStr)}
                className={`bg-white p-2 min-h-[100px] flex flex-col group transition-all ${!item.isCurrentMonth ? 'opacity-40' : ''} hover:bg-blue-50/30 cursor-pointer relative`}
              >
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      isToday ? 'bg-red-500 text-white' : 
                      (holidayInfo?.isHoliday || isWeekend) ? 'text-red-500' : 'text-gray-800'
                    }`}>
                      {item.date.getDate()}
                    </span>
                    <span className={`text-[9px] font-medium leading-tight ${isFestival ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>
                      {lunarText}
                    </span>
                  </div>

                  {holidayInfo && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${holidayInfo.isHoliday ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {holidayInfo.label === '班' ? '班' : '休'}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.map(e => (
                    <div key={e.id} className={`text-[10px] px-2 py-0.5 rounded truncate shadow-sm ${
                      e.type === 'work' ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' :
                      e.type === 'important' ? 'bg-red-50 text-red-700 border-l-2 border-red-500' :
                      'bg-green-50 text-green-700 border-l-2 border-green-500'
                    }`}>
                      {e.title}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-blue-600 text-white p-1 rounded-full shadow-md">
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
