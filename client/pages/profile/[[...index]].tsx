import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
      >
        ← Back to Home
      </button>

      {/* Clerk User Profile */}
      <UserProfile />
    </div>
  );
}
