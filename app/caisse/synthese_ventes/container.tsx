"use client";
import React, { useState } from "react";
import Tabs from "../components/Tabs";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ChiffreAffaire from "./components/chiffreaffaire/main";
import MonthYearSelector from "./components/monthyearselector";
import { number } from "yup";
import DetailChiffre from "./components/detailchiffre/main";
import Tickets from "./components/tickets/main";
import Reglements from "./components/reglements/main";
import FondsCaisse from "./components/fondscaisse/main";
import DetailTVA from "./components/detailtva/main";

export default function Container({
  salesData,
  salesByArticleType,
  ticketsData,
  reglementsData,
  fondsCaisseData,
  detailTvaData,
  viewType,
}: any) {
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
        <div className="  border p-10 overflow-auto">
          <ChiffreAffaire
            salesData={salesData}
            salesByArticleType={salesByArticleType}
            viewType={viewType}
          />
        </div>
      ),
    },
    {
      label: "Détail chiffres",
      content: (
        <div className=" border p-10  overflow-auto">
          <DetailChiffre
            salesByArticleType={salesByArticleType}
            viewType={viewType}
          />
        </div>
      ),
    },
    {
      label: "Tickets",
      content: (
        <div className=" border p-10  overflow-auto">
          <Tickets ticketsData={ticketsData} viewType={viewType} />
        </div>
      ),
    },
    {
      label: "Règlements",
      content: (
        <div className=" border p-10  overflow-auto">
          <Reglements reglementsData={reglementsData} viewType={viewType} />
        </div>
      ),
    },
    {
      label: "Fonds de caisse",
      content: (
        <div className=" border p-10  overflow-auto">
          <FondsCaisse fondsCaisseData={fondsCaisseData} viewType={viewType} />
        </div>
      ),
    },
    {
      label: "Détail TVA",
      content: (
        <div className=" border overflow-auto p-10  ">
          <DetailTVA detailTvaData={detailTvaData} viewType={viewType} />
        </div>
      ),
    },
  ];
  return (
    <div className=" ">
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
