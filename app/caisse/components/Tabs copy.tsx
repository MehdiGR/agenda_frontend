"use client";
// Tabs.tsx
import React, { useState, ReactElement } from "react";

// interface TabsProps {
//   children: ReactElement[];
// }
const TablePanel = ({ content }: any) => {
  <div className="w-full h-full">{content} </div>;
};
const Tabs = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex md:justify-center lg:justify-start">
        {React.Children.toArray(children).map((child: any, index: number) => (
          <button
            key={index}
            className={`py-2 px-4 focus:outline-none ${
              index === activeTab
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {child.props["aria-label"]}
          </button>
        ))}
      </div>
      <div className="mt-4">{React.Children.toArray(children)[activeTab]}</div>
    </div>
    // <div>{children}</div>
  );
};
export default Tabs;
