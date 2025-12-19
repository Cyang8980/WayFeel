import { useRouter } from "next/router";
import { useUser, SignInButton } from "@clerk/nextjs";
import { CustomUserButton } from "@/components/CustomUserButton";
import styled from "styled-components";
import Image from "next/image";

interface SidebarProps {
  activeItem: string;
  onSetActiveItem: (item: string) => void;
}

const ButtonWrapper = styled.div`
  margin: 20px;
`;

type MenuItem = {
  id: string;
  label: React.ReactNode;
  action: () => void;
};

const insertUser = async (user: {
  id: string;
  first_name: string;
  last_name: string;
}) => {
  try {
    const response = await fetch("/api/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to insert user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSetActiveItem }) => {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const menuItems: MenuItem[] = [
    { id: "home", label: "🏠", action: () => router.push("/appPage") },
    // { id: "analytics", label: "📊", action: () => router.push("/analytics") },
    {
      id: "calander",
      label: "📅",
      action: () => router.push("/calendar"),
    },
    {
      id: "ko-fi",
      label: (
        <Image src="/kofi_symbol.svg" alt="Ko-Fi" width={24} height={24} />
      ),
      action: () => window.open("https://ko-fi.com/wayfeel", "_blank"),
    },
    { id: "terms", label: "📜", action: () => router.push("/termsPage") },
    {
      id: "onBoard",
      label: "🚢",
      action: async () => {
        if (isSignedIn) {
          try {
            console.log("Calling insertUser with:", {
              id: user.id,
              first_name: user.firstName,
              last_name: user.lastName,
            });
            await insertUser({
              id: user.id!,
              first_name: user.firstName!,
              last_name: user.lastName!,
            });
            console.log("User successfully inserted!");
          } catch (error) {
            console.error("Failed to insert user:", error);
          }
        }
      },
    },
  ];

  return (
    <aside className="w-20 max-w-20 bg-[#E2CACA] text-white h-auto max-h-[600px] fixed top-20 left-4 rounded-2xl shadow-lg transform transition-all duration-300 z-50 flex flex-col py-4">
      {!isSignedIn ? (
        <div className="px-2">
          <SignInButton>
            <button className="text-white bg-blue-600 px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <div className="px-2 mb-2">
          <ButtonWrapper>
            <CustomUserButton />
          </ButtonWrapper>
        </div>
      )}
      <ul className="flex-1 flex flex-col items-center space-y-2 px-2">
        {menuItems.map((item) => (
          <li key={item.id} className="w-full">
            <button
              onClick={() => {
                onSetActiveItem(item.id);
                item.action();
              }}
              className={`w-full text-center px-4 py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-[#d4b8b8] transition-all ${
                activeItem === item.id ? "bg-[#c9a5a5] shadow-md" : ""
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
