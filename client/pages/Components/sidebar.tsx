import React from "react";
import { MenuIcon, CloseIcon } from "./icons";

// Define types for the props
interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  onToggleSidebar: () => void;
  onSetActiveItem: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeItem,
  onToggleSidebar,
  onSetActiveItem,
}) => {
  const menuItems = [
    { id: "home", label: "🏠 Home" },
    { id: "analytics", label: "📊 Analytics" },
    { id: "profile", label: "👤 Profile" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-gray-800 text-white w-64 transition-transform duration-300 ease-in-out z-20 mt-14`}
    >
      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSetActiveItem(item.id);
              onToggleSidebar();
            }}
            className={`flex items-center w-full p-3 mb-2 rounded-lg hover:bg-gray-700 transition-colors ${
              activeItem === item.id ? "bg-gray-700" : ""
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
