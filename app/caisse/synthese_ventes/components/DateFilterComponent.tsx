import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface MonthYearSelectorProps {
  months: string[];
  years: number[];
  selectedMonth: string;
  selectedYear: number;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  months,
  years,
  selectedMonth,
  selectedYear,
  handlePreviousMonth,
  handleNextMonth,
  handleMonthChange,
  handleYearChange,
}) => {
  return (
    <div className=" ">
      <button
        className="bg-slate-800 p-2 rounded-sm text-white"
        onClick={handlePreviousMonth}
        disabled={selectedMonth === "Janvier"}
      >
        <MdNavigateBefore />
      </button>
      <select
        className="border border-gray-200 p-2 ml-2 rounded-sm"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        {months.map((month, index) => (
          <option key={index + 1} data-value={index} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        className="border border-gray-200 p-2 ml-2 rounded-sm"
        value={selectedYear}
        onChange={handleYearChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button
        className="bg-slate-800 p-2 ml-2 rounded-sm text-white "
        onClick={handleNextMonth}
        disabled={selectedMonth === "Décembre"}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
};

export default MonthYearSelector;
