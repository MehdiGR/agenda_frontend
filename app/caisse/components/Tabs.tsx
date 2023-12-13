// components/Tabs.js
import { useState } from "react";

const TabContent = ({ content }) => <div className="mt-4">{content}</div>;

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex">
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
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        <TabContent content={tabs[activeTab].content} />
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
