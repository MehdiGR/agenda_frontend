"use client";
import React, { useState } from "react";
import Tabs from "../components/Tabs";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ChiffreAffaire from "./components/chiffreaffaire";
import MonthYearSelector from "./components/monthyearselector";
import { number } from "yup";

export default function Container({
  chiffre_affaires,
  viewType,
  valueDate,
}: any) {
  const [selectedMonth, setSelectedMonth] = useState("Janvier");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  //  array of months
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
    setSelectedMonth(event.target.value);
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
          dataProps={chiffre_affaires}
          viewType={viewType}
          date={valueDate}
        />
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
