import { useRouter } from "next/router";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { UserButton } from '@clerk/nextjs'
import { CustomUserButton } from "@/pages/profile/[[...index]]";


interface SidebarProps {
  activeItem: string;
  onSetActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSetActiveItem }) => {
  const router = useRouter();
  const { openUserProfile } = useClerk();
  const { user } = useUser();

  const menuItems = [
    { id: "home", label: "🏠", action: () => router.push("/") },
    // { id: "analytics", label: "📊", action: () => router.push("/analytics") },
    { id: "calander", label: "📅", action: () => router.push("/calander/calander") },
    { id: "timeline", label: "🕑", action: () => router.push("/timeline/timeline") },
    // { id: "profile", label: "👤", action: openUserProfile },
    { id: "settings", label: "⚙️", action: () => alert("not done yet") },
    // { id: "settings", label: "⚙️", action: () => router.push("/settings") },
  ];

  return (
    <aside className={`w-16 bg-gray-900 text-white h-screen fixed top-10 left-0 transform transition-transform duration-300 z-50`}>
      {/* Sidebar Items */}
      <ul className="mt-4 space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => {
                onSetActiveItem(item.id);
                item.action();
              }}
              className={`w-full text-left px-6 py-3 flex items-center gap-2 hover:bg-gray-700 transition ${
                activeItem === item.id ? "bg-gray-800" : ""
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
