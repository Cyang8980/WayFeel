import React from "react";
import SideBarSlot from "./SideBarSlot";


export default function CalendarShell({

  activeItem,
  setActiveItem,
  children,
}: React.PropsWithChildren<{
  activeItem: string;
  setActiveItem: (s: string) => void;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <SideBarSlot activeItem={activeItem} setActiveItem={setActiveItem} />
      {children}
    </div>
  );
}
