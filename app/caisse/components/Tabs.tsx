"use client";
// Tabs.tsx
import React, { useState, ReactElement } from "react";

interface TabsProps {
  label: string;
  content: ReactElement;
}
// const TablePanel = ({ content }: { content: ReactElement }) => {
const TablePanel = ({ content }: { content: ReactElement }) => {
  return <div className="w-full h-full">{content} </div>;
};
const Tabs = ({ tabs }: { tabs: TabsProps[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex md:justify-center lg:justify-start">
        {tabs.map((tab: any, index: number) => (
          <button
            key={index}
            className={`py-2 px-4 focus:outline-none ${
              index === activeTab
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab["label"]}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <TablePanel content={tabs[activeTab].content} />
      </div>
    </div>
    // <div>{children}</div>
  );
};
export default Tabs;
