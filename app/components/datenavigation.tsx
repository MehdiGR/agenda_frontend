import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface DateNavigationProps {
  selectedDate: Date;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  selectedDate,
  handlePreviousDay,
  handleNextDay,
  handleDateChange,
}) => {
  return (
    <div className=" ">
      <button
        className="bg-slate-800 p-2 rounded-sm text-white"
        onClick={handlePreviousDay}
      >
        <MdNavigateBefore />
      </button>
      <input
        className="border border-gray-200 p-2 ml-2 rounded-sm"
        type="date"
        value={selectedDate.toISOString().substr(0, 10)}
        onChange={handleDateChange}
      />
      <button
        className="bg-slate-800 p-2 ml-2 rounded-sm text-white"
        onClick={handleNextDay}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
};

export default DateNavigation;
