import { BsTicketPerforated } from "react-icons/bs";
import { FaMagento } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

const SidebarItem = ({ icon, label, count, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center justify-between px-2 py-3 mx-2 rounded cursor-pointer transition-colors ${
        isActive
          ? "bg-white text-black"
          : "text-white hover:bg-gray-700 hover:text-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count && (
        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
          {count}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 bg-black fixed h-screen  flex flex-col">
      {/* Logo area */}
      <div className="p-4">
        {/* <div className="p-4 border-b border-gray-700"> */}
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold text-lg">TurinIQ</span>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-4">
        {/* <SidebarItem icon={<FiInbox />} label="Inbox" to="/inbox" /> */}
        <SidebarItem icon={<FaMagento />} label="Agent" to="/turin-agent" />
        {/* <SidebarItem icon={<FiBook />} label="Knowledge Base" to="/knowledge-base" /> */}
        <SidebarItem
          icon={<BsTicketPerforated />}
          label="Tickets"
          to="/Tickets"
        />
        <SidebarItem icon={<MdLeaderboard />} label="Leads" to="/leads" />
      </div>

      {/* Bottom section */}
      {/* <div className="border-t border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-sm"><FiSearch /></span>
            <span className="text-sm">Search</span>
            <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">Ctrl K</span>
          </div>
        </div>

        <div className="px-2 pb-4">
          <SidebarItem icon={<FiBook />} label="Get set up" to="/setup" />
          <SidebarItem icon={<FiBook />} label="Settings" to="/settings" />
          <SidebarItem icon={<FiBook />} label="Profile" to="/profile" />
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
