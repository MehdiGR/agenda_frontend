// components/Tabs.js
"use client";
import { ReactElement, useState, ReactNode } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
}

const TabContent = ({ content }: { content: ReactElement }) => (
  <div className="mt-4">{content}</div>
);

const Tabs = ({
  children,
}: {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = Array.isArray(children) ? children : [children];

  return (
    <div>
      <div className={`flex `}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${
              index === activeTab
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } py-2 px-4 focus:outline-none`}
            onClick={() => setActiveTab(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      <div>
        <TabContent content={tabs[activeTab].props.children} />
      </div>
    </div>
  );
};

export default Tabs;

/*
example
 const tabs = [
    {
      label: "caisse",
      content: (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1">
          <CaisseForm
            clients={clients}
            collabOptions={collabOptions}
            tickets={ticketState}
            agendas={agendas}
            removePrestation={removePrestation}
            totalTTC={totalTTC}
            updateAgendaInTable={updateAgendaInTable}
            selectedResponsable={selectedResponsable}
            setSelectedResponsable={setSelectedResponsable}
          />
          <Prestations
            prestations={prestations}
            addPrestation={addPrestation}
            vendeur={selectedResponsable}
          />
        </div>
      ),
    },
    {
      label: "tickets",
      content: (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1">
          <h1>tab2</h1>
        </div>
      ),
    },
  ];
*/
