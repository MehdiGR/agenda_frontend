import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface MonthYearSelectorProps {
  months: string[];
  years: number[];
  selectedMonth: string;
  selectedYear: number;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNextYear: () => void;
  handlePreviousYear: () => void;
  viewType: string; // Pas
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
  handleNextYear,
  handlePreviousYear,
  viewType,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const [viewTypeState, setViewType] = useState("monthly"); // Initialize state with 'monthly'
  useEffect(() => {
    console.log("useEffect", viewType);
    setViewType(viewType);
  }, [viewType]);

  return (
    <div className=" ">
      {/* <p>{viewTypeState}</p> */}
      <select
        className="border border-gray-200 p-2 mr-6 rounded-sm"
        value={viewTypeState}
        onChange={(e) => {
          setViewType(e.target.value);
          params.set("viewType", e.target.value);
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <button
        className="bg-slate-800 p-2 rounded-sm text-white"
        onClick={
          viewTypeState == "monthly"
            ? () => handlePreviousMonth()
            : () => handlePreviousYear()
        }
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
        onClick={
          viewTypeState == "monthly"
            ? () => handleNextMonth()
            : () => handleNextYear()
        }
        disabled={selectedMonth === "Décembre"}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
};

export default MonthYearSelector;
