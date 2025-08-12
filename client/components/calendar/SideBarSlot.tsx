import React from "react";
import Sidebar from "@/components/sidebar";

export default function SideBarSlot({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (s: string) => void;
}) {
  return (
    <div className="w-1/6 fixed top-16 left-0 p-4 z-20 h-[calc(100vh-4rem)] overflow-hidden">
      <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
    </div>
  );
}
