import React, { useState } from "react";
import Sidebar from "@/Components/sidebar";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar open/close
  };

  const setActiveMenuItem = (id: string) => {
    setActiveItem(id); // Set the active menu item
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar
        activeItem={activeItem}
        onSetActiveItem={setActiveMenuItem}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-600 p-3 rounded"
        >
          {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>

        {/* Main Content Here */}
        <div>
          <h1 className="text-2xl">Main Content</h1>
          <p>Currently selected item: {activeItem}</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
