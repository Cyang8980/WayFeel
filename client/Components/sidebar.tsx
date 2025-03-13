import { useRouter } from "next/router";
import { useUser, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "../pages/profile/[[...index]]";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeItem: string;
  onSetActiveItem: (item: string) => void;
}

type MenuItem = {
  id: string;
  label: React.ReactNode;
  action: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSetActiveItem }) => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures the button is only rendered on the client
  }, []);

  const menuItems: MenuItem[] = [
    { id: "home", label: "🏠", action: () => router.push("/") },
    { id: "analytics", label: "📊", action: () => alert("not done yet") },
    { id: "settings", label: "⚙️", action: () => alert("not done yet") },
    {
      id: "ko-fi",
      label: <img src="kofi_symbol.svg" alt="Ko-Fi" style={{ width: 24, height: 24 }} />,
      action: () => window.open("https://ko-fi.com/wayfeel", "_blank"),
    },
  ];

  return (
    <aside className="w-21 bg-gray-900 text-white h-screen fixed top-0 left-0 transform transition-transform duration-300 z-50">
      {!isSignedIn ? (
        <SignInButton>
          <button className="text-white bg-blue-600 px-2 py-2 rounded hover:bg-blue-700 transition-colors mt-4 ml-1 mr-1">
            Sign In
          </button>
        </SignInButton>
      ) : (
        <CustomUserButton/>
      )}
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
