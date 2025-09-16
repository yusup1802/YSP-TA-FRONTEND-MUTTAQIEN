import { useState } from "react";
import HandleLogout from "../utils/HandleLogout";

export default function DrawerLayout({ sidebarItems, renderContent }) {
  const [activeTab, setActiveTab] = useState(sidebarItems?.[0]?.value || "");
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
        {renderContent(activeTab)}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {sidebarItems.map((item) => (
            <li
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={activeTab === item.value ? "bg-gray-700" : ""}
            >
              <a>{item.label}</a>
            </li>
          ))}
          <HandleLogout />
        </ul>
      </div>
    </div>
  );
}
