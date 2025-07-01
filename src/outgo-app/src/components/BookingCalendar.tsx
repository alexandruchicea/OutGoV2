import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void;
  bookedDates?: Date[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect, bookedDates = [] }) => {
  const [value, onChange] = useState<Value>(new Date());

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (bookedDates.find(d => d.toDateString() === date.toDateString())) {
        return 'bg-red-200'; // Highlight booked dates
      }
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
      <Calendar
        onChange={(val) => {
          if (val instanceof Date) {
            onChange(val);
            onDateSelect(val);
          } else if (Array.isArray(val) && val[0] instanceof Date) {
            onChange(val[0]);
            onDateSelect(val[0]);
          }
        }}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default BookingCalendar;
