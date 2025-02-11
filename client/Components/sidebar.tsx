import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

interface SidebarProps {
  activeItem: string;
  onSetActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onSetActiveItem,
}) => {
  const router = useRouter();
  const { openUserProfile } = useClerk();

  const menuItems = [
    { id: "home", label: "🏠", action: () => router.push("/") },
    { id: "analytics", label: "📊", action: () => router.push("/analytics") },
    { id: "profile", label: "👤", action: openUserProfile },
    { id: "settings", label: "⚙️", action: () => router.push("/settings") },
  ];

  return (
    <aside
      className={`w-16 bg-gray-900 text-white h-screen fixed top-0 left-0 transform transition-transform duration-300 z-50`}
    >
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
