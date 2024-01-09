"use client";
import DateNavigation from "@/app/components/datenavigation";
import React, { useState } from "react";
import Tabs from "../components/Tabs";
import Tickets from "./components/tickets";
import OperationCaisse from "./components/operationcaisse";
import Encaissements from "./components/encaissements";
import Synths from "./components/synthese";

export default function Container({
  tickets,
  operationCaisse,
  encaissements,
  synths,
}: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleNextDay = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
  };

  const handlePreviousDay = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
  };

  const handleDateChange = (event: any) => {
    setSelectedDate(new Date(event.target.value));
  };
  const tabs = [
    {
      label: "Tickets",
      content: <Tickets data={tickets} valueDate={selectedDate} />,
    },
    {
      label: "Opération de caisse",
      content: (
        <OperationCaisse data={operationCaisse} valueDate={selectedDate} />
      ),
    },
    {
      label: "Encaissements",
      content: <Encaissements data={encaissements} valueDate={selectedDate} />,
    },
    {
      label: "Synthèse",
      content: <Synths data={synths} valueDate={selectedDate} />,
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
