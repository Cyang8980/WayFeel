import React from "react";
import SideBarSlot from "./SideBarSlot";
import NavBar from "./Navbar";

export default function CalendarShell({
  googleConnected,
  onConnectGoogle,
  activeItem,
  setActiveItem,
  children,
}: React.PropsWithChildren<{
  googleConnected: boolean;
  onConnectGoogle: () => void;
  activeItem: string;
  setActiveItem: (s: string) => void;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <NavBar googleConnected={googleConnected} onConnectGoogle={onConnectGoogle} />
      <SideBarSlot activeItem={activeItem} setActiveItem={setActiveItem} />
      {children}
    </div>
  );
}
