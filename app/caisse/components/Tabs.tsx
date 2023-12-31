"use client";
// components/Tabs.tsx
import React, { ReactElement, useState } from "react";

interface TabPanelProps {
  content: ReactElement;
}

const TabPanel: React.FC<TabPanelProps> = ({ content }) => (
  <div className="mt-4">{content}</div>
);

interface Tab {
  label: string;
  content: ReactElement;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex md:justify-center lg:justify-start">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 focus:outline-none border-r-[1px]  border-gray-400 ${
              index === activeTab
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } ${index === 0 ? "rounded-tl-lg" : ""} ${
              index === tabs.length - 1 ? "rounded-tr-lg" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TabPanel content={tabs[activeTab].content} />
    </div>
  );
};

export default Tabs;
