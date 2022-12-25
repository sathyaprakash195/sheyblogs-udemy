import React from "react";

function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div>
      <div className="flex gap-5 border-b px-2 border-gray-300">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`p-2  cursor-pointer rounded-t-lg
             ${activeTab === index ? "bg-primary text-white" : "bg-gray-200 "}
            `}
          >
            {tab.name}
          </div>
        ))}
      </div>

      <div className="mt-5 px-2">{tabs[activeTab].component}</div>
    </div>
  );
}

export default Tabs;
