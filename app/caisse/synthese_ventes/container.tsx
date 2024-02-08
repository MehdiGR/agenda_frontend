"use client";
import React, { useState } from "react";
import Tabs from "../components/Tabs";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ChiffreAffaire from "./components/chiffreaffaire/main";
import MonthYearSelector from "./components/monthyearselector";
import { number } from "yup";

export default function Container({
  salesData,
  salesByArticleType,
  viewType,
  valueDate,
}: any) {
  console.log("the valid date is ", valueDate);
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const today = new Date(); // Note: getMonth() returns a zero-based index (0-11)
  const currentMonthIndex = today.getMonth(); // Note: getMonth() returns a zero-based index (0-11)
  const currentMonth = months[currentMonthIndex];
  const currentYear = today.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  //  array of months
  //array of years
  const years = Array.from(
    { length: new Date().getFullYear() - 2021 + 1 },
    (_, i) => 2021 + i
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      let nextMonthIndex = months.indexOf(prev) + 1;
      // if (nextMonthIndex >= months.length) {
      //   nextMonthIndex = 0; // Reset to January
      // }
      params.set(
        "date",
        selectedYear +
          "-" +
          (Number(nextMonthIndex) + 1).toString().padStart(2, "0") +
          "-" +
          "01"
      ); // changed to nextDay
      router.push(`${pathname}?${params.toString()}`);
      return months[nextMonthIndex];
    });
  };

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => {
      let previousMonthIndex = months.indexOf(prev) - 1;
      if (previousMonthIndex < 0) {
        previousMonthIndex = months.length - 1; // Go to December
      }
      params.set(
        "date",
        selectedYear +
          "-" +
          (Number(previousMonthIndex) + 1).toString().padStart(2, "0") +
          "-" +
          "01"
      ); // changed to nextDay
      router.push(`${pathname}?${params.toString()}`);
      return months[previousMonthIndex];
    });
  };
  const handleNextYear = () => {
    setSelectedYear((prev) => {
      let nextYear = prev + 1;
      params.set("date", nextYear + "-01-01");
      router.push(`${pathname}?${params.toString()}`);
      return nextYear;
    });
  };

  const handlePreviousYear = () => {
    setSelectedYear((prev) => {
      let previousYear = prev - 1;
      params.set("date", previousYear + "-01-01");
      router.push(`${pathname}?${params.toString()}`);
      return previousYear;
    });
  };
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value;
    const monthIndex = months.indexOf(event.target.value);
    setSelectedMonth(month);
    params.set(
      "date",
      selectedYear +
        "-" +
        (Number(monthIndex) + 1).toString().padStart(2, "0") +
        "-" +
        "01"
    ); // changed to nextDay
    router.push(`${pathname}?${params.toString()}`);
  };
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    if (!isNaN(newYear) && years.includes(newYear)) {
      setSelectedYear(newYear);
      params.set("date", newYear + "-01-01");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const tabs = [
    {
      label: "Chiffre d'affaires",
      content: (
        <ChiffreAffaire
          salesData={salesData}
          salesByArticleType={salesByArticleType}
          viewType={viewType}
          date={valueDate}
        />
      ),
    },
    {
      label: "Détail chiffres",
      content: (
        <div>
          <h1>detail</h1>
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <div className="flex justify-center ">
        <MonthYearSelector
          months={months}
          years={years}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleNextMonth={handleNextMonth}
          handlePreviousMonth={handlePreviousMonth}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          handleNextYear={handleNextYear}
          handlePreviousYear={handlePreviousYear}
          viewType={viewType} // Pass the viewType prop here
        />
      </div>
      <br />
      <Tabs tabs={tabs} />
    </div>
  );
}
