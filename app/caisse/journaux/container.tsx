"use client";
import DateNavigation from "@/app/components/datenavigation";
import React, { useState } from "react";
import Tabs from "../components/Tabs";
import Tickets from "./components/tickets";
import OperationCaisse from "./components/operationcaisse";
import Encaissements from "./components/encaissements";
import Synths from "./components/synthese";
import { useRouter } from "next/navigation"; // Replace with your actual import path
import { useSearchParams, usePathname } from "next/navigation";

export default function Container({
  tickets,
  encaissements,
  operation_caisse,
  synths,
  valueDate,
}: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log("date", selectedDate);
  // Inside your component
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const nextDay = new Date(prev);
      nextDay.setDate(nextDay.getDate() + 1);
      params.set("date", nextDay.toISOString().split("T")[0]); // changed to nextDay
      router.push(`${pathname}?${params.toString()}`);
      return nextDay;
    });
  };

  const handlePreviousDay = () => {
    setSelectedDate((prev) => {
      const previousDay = new Date(prev);
      previousDay.setDate(previousDay.getDate() - 1);
      params.set("date", previousDay.toISOString().split("T")[0]); // changed to previousDay

      // Update the URL
      router.push(`${pathname}?${params.toString()}`);
      return previousDay;
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(() => {
      const newSelectedDate = new Date(event.target.value);
      params.set("date", newSelectedDate.toISOString().split("T")[0]);
      router.push(`${pathname}?${params.toString()}`);
      return newSelectedDate;
    });
  };
  const tabs = [
    {
      label: "Tickets",
      content: (
        <div className=" border p-6 overflow-auto">
          <Tickets data={tickets} />
        </div>
      ),
    },
    {
      label: "Opération de caisse",
      content: (
        <div className=" border p-6 overflow-auto">
          <OperationCaisse data={operation_caisse} />
        </div>
      ),
    },
    {
      label: "Encaissements",
      content: (
        <div className=" border p-6 overflow-auto">
          <Encaissements data={encaissements} />
        </div>
      ),
    },
    {
      label: "Synthèse",
      content: (
        <div className=" border p-6 overflow-auto">
          <Synths data={synths} />
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <div className="flex justify-center ">
        <DateNavigation
          selectedDate={selectedDate}
          handlePreviousDay={handlePreviousDay}
          handleNextDay={handleNextDay}
          handleDateChange={handleDateChange}
        />
      </div>
      <br />
      <Tabs tabs={tabs} />
    </div>
  );
}
